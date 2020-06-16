import React from 'react';
import '../App.css';
import {
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    InputBase
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import Data from '../js/data.json';
import User from '../js/user.json';
import { ec as EC } from 'elliptic';
import { reactLocalStorage } from 'reactjs-localstorage';
import LinearProgress from '@material-ui/core/LinearProgress';

const { Blockchain, Transaction } = require('../../src/js/blockchain');
// const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Home extends React.Component {
    state = {
        Users: [],
        MyCoin: {},
        IsOpenMine: false,
        IsOpenAdd: false,
        IsOpenSuccess: false,
        IsOpenTransHis: false,
        transHis: [],
        toAddress: "",
        cost: 0,
        fromAddress: "",
        fromPrivatekey: "",
        note: "",
        titleNote: "",
        mining: false,
        searchText: "",
        publicKeyMine: ""
    };

    componentWillMount() {
        if (reactLocalStorage.get("Data")) {
            this.setState(
                {
                    MyCoin: new Blockchain(JSON.parse(reactLocalStorage.get("Data")))
                }
            )
        }
        else {
            reactLocalStorage.set("Data", JSON.stringify(Data));
            this.setState(
                {
                    MyCoin: new Blockchain(Data)
                }
            )
        };
        if (reactLocalStorage.get("Users")) {
            this.setState(
                {
                    Users: JSON.parse(reactLocalStorage.get("Users"))
                }
            )
        }
        else {
            reactLocalStorage.set("Users", JSON.stringify(User));
            this.setState(
                {
                    Users: User
                }
            )
        }
    };

    AddWallet = () => {
        const key = ec.genKeyPair();
        const privateKey = key.getPrivate('hex');
        const publicKey = key.getPublic('hex');
        var newUsers = this.state.Users;
        newUsers.push({
            name: "Wallet" + (newUsers.length + 1),
            privateKey: privateKey,
            publicKey: publicKey
        })
        this.setState({
            Users: newUsers,
        });
        reactLocalStorage.set("Users", JSON.stringify(this.state.Users));
    };

    handleClickOpen = (publicKey) => {
        this.setState({
            IsOpenMine: true,
            publicKeyMine: publicKey
        });
    };

    handleClose = () => {
        this.setState({
            IsOpenMine: false
        });
    };

    handleClickOpenAdd = (publicKey, privateKey) => {
        this.setState({
            fromAddress: publicKey,
            fromPrivatekey: privateKey,
            IsOpenAdd: true
        });
    };

    handleCloseAdd = () => {
        this.setState({
            IsOpenAdd: false
        });
    };

    handleCloseSuccess = () => {
        this.setState({
            IsOpenSuccess: false
        });
    };

    mine = () => {
        this.setState({
            mining: true
        });
        setTimeout(() => {
            const res = this.state.MyCoin.minePendingTransactions(this.state.publicKeyMine);
            var json = JSON.stringify(this.state.MyCoin);
            reactLocalStorage.set('Data', json);
            if (res === 'Block successfully mined!') {
                this.setState({
                    IsOpenMine: false,
                    IsOpenSuccess: true,
                    note: res,
                    titleNote: "Mine",
                    mining: false
                });
            }
        }, 500);
    };

    send = () => {
        const tx1 = new Transaction(this.state.fromAddress, this.state.toAddress, this.state.cost);
        const privateKey = ec.keyFromPrivate(this.state.fromPrivatekey);
        tx1.signTransaction(privateKey);
        const res = this.state.MyCoin.addTransaction(tx1);
        if (res === 'send coin success') {
            this.setState({
                IsOpenAdd: false,
                IsOpenSuccess: true,
                note: "Send coin success!!!",
                titleNote: "Send coin"
            });
        }
        else {
            this.setState({
                IsOpenSuccess: true,
                note: res,
                titleNote: "Send coin"
            });
        }
        var json = JSON.stringify(this.state.MyCoin);
        reactLocalStorage.set('Data', json);

    };

    RenderTransaction(transaction) {
        return (
            <Grid container direction="column" style={{ paddingRight: "1%", paddingLeft: "1%", height: "25%", width: "94%", marginLeft: "3%", marginRight: "3%", marginBottom: 10, border: "1px solid #c4c2c2" }}>
                <Grid item container direction="row" >
                    <Grid item xs={3} >
                        <p style={{ fontSize: 14 }}>Sending address</p>
                    </Grid>
                    <Grid item xs={9} >
                        <InputBase eld id="input" defaultValue={transaction.fromAddress}
                            disabled={true}
                            InputProps={{
                                'aria-label': 'naked',
                            }}
                            style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "2%" }}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction="row">
                    <Grid item xs={3}>
                        <p style={{ fontSize: 14 }}>Receiving address</p>
                    </Grid>
                    <Grid item xs={9} >
                        <InputBase id="input" defaultValue={transaction.toAddress}
                            disabled={true}
                            InputProps={{
                                'aria-label': 'naked',
                            }}
                            style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "2%" }}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction="row">
                    <Grid item xs={3} style={{ marginTop: 9 }}>
                        <MonetizationOnTwoToneIcon style={{ color: '#fcb20d' }}></MonetizationOnTwoToneIcon>
                    </Grid>
                    <Grid item xs={9}  >
                        <p style={{ fontSize: 13, color: "#43a047" }}>{transaction.amount}</p>
                    </Grid>
                </Grid>
                <Grid item container direction="row">
                    <Grid item xs={3}>
                        <p style={{ fontSize: 14 }}>Time</p>
                    </Grid>
                    <Grid item xs={9} >
                        <p style={{ fontSize: 13, color: "#43a047" }}>{new Date(transaction.timestamp).toDateString()}</p>
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    renderSendCoin() {
        return (
            <Grid container direction="column" style={{ paddingRight: "1%", paddingLeft: "1%", height: "25%", width: "94%", marginLeft: "3%", marginRight: "3%", marginBottom: 10, border: "1px solid #c4c2c2" }}>
                <Grid item container direction="row">
                    <Grid item xs={3}>
                        <p style={{ fontSize: 14 }}>Receiving address</p>
                    </Grid>
                    <Grid item xs={9} >
                        <TextField id="standard-basic" value={this.state.toAddress}
                            onChange={(event) => { this.setState({ toAddress: event.target.value }); }}
                            style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "2%" }}
                        />
                    </Grid>
                </Grid>
                <Grid item container direction="row">
                    <Grid item xs={3} style={{ marginTop: 9 }}>
                        <MonetizationOnTwoToneIcon style={{ color: '#fcb20d' }}></MonetizationOnTwoToneIcon>
                    </Grid>
                    <Grid item xs={9}  >
                        <TextField id="standard-basic" value={this.state.cost}
                            type="number"
                            onChange={(event) => { this.setState({ cost: event.target.value }); }}
                            style={{ fontSize: 13, color: "#43a047", width: "20%", marginTop: "2%" }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    RenderUser(user) {
        return (
            <Grid container direction="row" alignItems="center" justify="space-between" style={{ borderRadius: 35, padding: "0px 10px 0 15px", margin: "10px 0" }}>
                <ExpansionPanel style={{ width: "100%", border: "1px solid #c4c2c2" }} alignItems="center" justify="center">
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>
                            <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
                                <AccountCircleIcon style={{ fontSize: 30, color: "#43a047" }} ></AccountCircleIcon>
                                <p style={{ fontSize: 18, marginLeft: 10 }}>{user.name}</p>
                                <MonetizationOnTwoToneIcon style={{ marginLeft: 150, color: '#fcb20d' }}></MonetizationOnTwoToneIcon>
                                <p style={{ fontSize: 17, color: "#43a047" }}> &nbsp;{this.state.MyCoin.getBalanceOfAddress(user.publicKey)}</p>
                            </Grid>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography style={{ height: "25%", width: "100%" }}>
                            <Grid container direction="row" spacing={3}>
                                <Grid item xs={3} >
                                    <p style={{ fontSize: 14 }}>Private key</p>
                                </Grid>
                                <Grid item xs={9} >
                                    <InputBase eld id="input" defaultValue={user.privateKey}
                                        disabled={true}
                                        InputProps={{
                                            'aria-label': 'naked',
                                        }}
                                        style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "4%" }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction="row">
                                <Grid item xs={3}>
                                    <p style={{ fontSize: 14 }}>Public key</p>
                                </Grid>
                                <Grid item xs={9} >
                                    <InputBase id="input" defaultValue={user.publicKey}
                                        disabled={true}
                                        InputProps={{
                                            'aria-label': 'naked',
                                        }}
                                        style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "4%" }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container direction="row" >
                                <Grid item xs={5}  >
                                    <Button variant="contained"
                                        style={{ width: "100%", height: '57%', borderRadius: 20, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                                        onClick={() => this.handleClickOpenAdd(user.publicKey, user.privateKey)}>
                                        <p>Send Coin</p>
                                    </Button>
                                </Grid>
                                <Grid item xs={2}></Grid>

                                <Grid item xs={5}>
                                    <Button variant="contained"
                                        style={{ width: "100%", height: '57%', borderRadius: 20, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                                        onClick={() => this.handleClickOpen(user.publicKey)}>
                                        Mine
                  </Button>
                                </Grid>

                            </Grid>
                            <Grid item container direction="row">
                                <Button variant="contained"
                                    style={{ width: "100%", height: '5%', borderRadius: 20, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                                    onClick={() => this.getTransHisUser(user.publicKey)}>
                                    Transactions history
            </Button>
                            </Grid>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
        )
    };

    renderListUsers = () => {
        console.log("btc", this.state.MyCoin);
        const users = this.state.Users;

        return (
            <>
                {users.map((user, index) => this.RenderUser(user, index))}
            </>
        );
    };

    renderListPendingTransactions = (trans) => {
        return (
            <>
                {trans.map((tran, index) => this.RenderTransaction(tran))}
                {this.state.mining ? <LinearProgress color="secondary" /> : null}
            </>
        );
    };

    renderListTransactions = (block) => {

        const trans = block.transactions;
        return (
            <>
                {trans.map((tran, index) => this.RenderTransaction(tran))}
            </>
        );
    };

    render() {
        return (
            <>
                <Grid container direction="row" justify="center"
                    alignItems="flex-start" style={{ padding: "1% 2%" }}>
                    <Grid item container direction="column" alignItems="center" style={{ height: "100%", width: "90%", padding: "1.5% 2.5%", margin: "auto" }}>
                        <p style={{ fontSize: 30, fontWeight: "700", textAlign: "left", marginLeft: 10 }}>PEERS</p>
                        {this.renderListUsers()}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            style={{ width: "40%", height: 60, borderRadius: 10, marginTop: 10, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                            onClick={() => this.AddWallet()}
                        >
                            Add Wallet
                            </Button>
                    </Grid>
                </Grid>
                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={this.state.IsOpenMine}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">Pending Transaction</DialogTitle>
                    <DialogContent >
                        <DialogContentText id="alert-dialog-description">
                            {this.state.MyCoin.pendingTransactions[0] ?
                                this.renderListPendingTransactions(this.state.MyCoin.pendingTransactions) : "No transaction pending"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {this.state.MyCoin.pendingTransactions[0] ?
                            (<Button onClick={() => this.mine()}
                                color="primary">
                                Mine
                            </Button>) : null
                        }
                        <Button onClick={() => this.handleClose()} color="primary" autoFocus>
                            Cancel
          </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={this.state.IsOpenAdd}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">Send Coin</DialogTitle>
                    <DialogContent style={{}}>
                        <DialogContentText id="alert-dialog-description">
                            {this.renderSendCoin()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.send()}
                            color="primary">
                            Send
          </Button>
                        <Button onClick={() => this.handleCloseAdd()} color="primary" autoFocus>
                            Cancel
          </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.IsOpenSuccess}
                    onClose={this.handleCloseSuccess}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">{this.state.titleNote}</DialogTitle>
                    <DialogContent style={{}}>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.note}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCloseSuccess()} color="primary" autoFocus>
                            OK
          </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
};



export default Home;
