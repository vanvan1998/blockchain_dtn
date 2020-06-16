const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const debug = require('debug')('savjeecoin:blockchain');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }


    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signature = sig.toDER('hex');
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

//create block
class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
  }

  //hàm đào: khi nào hash có dificulty số 0 ở đầu thì ngưng
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    debug(`Block mined: ${this.hash}`);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

class Blockchain {
  constructor(options) {
    Object.assign(this, options);
    // this.chain = [this.createGenesisBlock()];
    // this.difficulty = 2;
    // this.pendingTransactions = [];
    // this.miningReward = 100;
  }
  

  //tạo block đầu tiên
  createGenesisBlock() {
    // Your private key goes here
    const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');

    // From that we can calculate your public key (which doubles as your wallet address)
    const myWalletAddress = myKey.getPublic('hex');

    return new Block(Date.parse('2020-05-16'), [new Transaction('address2', myWalletAddress,  200)], '0');
  }

  //lấy block cuối cùng
  getLatestBlock() { 
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    
    this.pendingTransactions = [];
    return 'Block successfully mined!';
  }

  //thêm giao dịch vào block
  addTransaction(transaction) {
    //địa chỉ gửi và nhận không trống
    if (!transaction.fromAddress || !transaction.toAddress) {
      return 'Transaction must include from and to address';
    }

    //kiểm tra hợp lệ không
    if (!transaction.isValid()) {
      return'Cannot add invalid transaction to chain';
    }

    //số tiền gửi đi lớn hơn 0
    if (transaction.amount <= 0) {
      return'Transaction amount should be higher than 0';
    }

    //số tiền gửi quá số tiền quy định
    if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
      return 'Not enough balance';
    }

    this.pendingTransactions.push(transaction);
    return 'send coin success';
  }

  //từ các gio dịch, tính số tiền hiện có
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= +trans.amount;
        }

        if (trans.toAddress === address) {
          balance += +trans.amount;
        }
      }
    }

      for (const trans of this.pendingTransactions) {
        if (trans.fromAddress === address) {
          balance -= +trans.amount;
        }

        if (trans.toAddress === address) {
          balance += +trans.amount;
        }
      }

    return balance;
  }

  getTransOfAddress(address) {
    let transactions = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          transactions.push(trans);
        }

        if (trans.toAddress === address) {
          transactions.push(trans);
        }
      }
    }

      for (const trans of this.pendingTransactions) {
        if (trans.fromAddress === address) {
          transactions.push(trans);
        }

        if (trans.toAddress === address) {
          transactions.push(trans);
        }
      }

    return transactions;
  }

  getAllTransactionsForWallet(address) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }

    debug('get transactions for wallet count: %s', txs.length);
    return txs;
  }

  //kiểm tra block đầu có đúng
  isChainValid() {
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
