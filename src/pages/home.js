import React from 'react';
import '../App.css';
import {
    Grid,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputBase,
    Paper,
} from '@material-ui/core';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import AddIcon from '@material-ui/icons/Add';
import Data from '../js/data.json';
import User from '../js/user.json';
import Listcadidates from '../js/listcadidates.json';
import { ec as EC } from 'elliptic';
import { reactLocalStorage } from 'reactjs-localstorage';
import LinearProgress from '@material-ui/core/LinearProgress';
import Ballot from '../assets/ballot.png';
import Avatar from '../assets/avatar-sample.jpg'
const { Blockchain, Transaction } = require('../../src/js/blockchain');
// const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Home extends React.Component {
    state = {
        Users: [],
        MyCoin: {},
        IsOpenAdd: false,
        IsOpenSuccess: false,
        IsOpenTransHis: false,
        transHis: [],
        toAddress: "",
        // cost: 0,
        fromAddress: "",
        fromPrivatekey: "",
        id: '',
        note: "",
        titleNote: "",
        mining: false,
        searchText: "",
        publicKeyMine: "",
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
        console.log('sssssssssssssssssss', this.state.Users);
        // const tx1 = new Transaction(null, publicKey, 3);
        // const privateKeyTran = ec.keyFromPrivate(privateKey);
        // tx1.signTransaction(privateKeyTran);
        const rewardTx = new Transaction(null, publicKey, 3);
        this.state.MyCoin.pendingTransactions.push(rewardTx);
        // const res = this.state.MyCoin.addTransaction(tx1);
        
        this.setState({
            mining: true
        });
        setTimeout(() => {
            const res = this.state.MyCoin.minePendingTransactions();
            var json = JSON.stringify(this.state.MyCoin);
            reactLocalStorage.set('Data', json);
            if (res === 'Block successfully mined!') {
                this.setState({
                    IsOpenSuccess: true,
                    note: 'Add successfull!',
                    titleNote: "Add ",
                    mining: false
                });
            }
        }, 500);

        var json = JSON.stringify(this.state.MyCoin);
        reactLocalStorage.set('Data', json);
    };

    handleCloseTransHis = () => {
        this.setState({
            IsOpenTransHis: false
        });
    };

    getTransHisUser = (publicKey) => {
        const trans = this.state.MyCoin.getTransOfAddress(publicKey);
        this.setState({
            transHis: trans,
            IsOpenTransHis: true,
            searchText: publicKey
        })
    }

    handleClickOpenAdd = ( name) => {
        this.setState({
            IsOpenAdd: true,
            toAddress: name
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
            const res = this.state.MyCoin.minePendingTransactions();
            var json = JSON.stringify(this.state.MyCoin);
            reactLocalStorage.set('Data', json);
            if (res === 'Block successfully mined!') {
                this.setState({
                    IsOpenSuccess: true,
                    note: 'Vote successfull!',
                    titleNote: "Vote",
                    mining: false
                });
            }
        }, 500);
    };

    send = () => {
        // thiếu bước xác thực
        const tx1 = new Transaction(this.state.fromAddress, this.state.toAddress, 1);
        const privateKey = ec.keyFromPrivate(this.state.fromPrivatekey);
        tx1.signTransaction(privateKey);
        const res = this.state.MyCoin.addTransaction(tx1);
        if (res === 'send coin success') {
            this.mine();
            this.setState({
                IsOpenAdd: false,
                // IsOpenSuccess: true,
                note: "Send coin success!!!",
                // titleNote: "Send coin"
            });
        }
        else {
            this.setState({
                // IsOpenSuccess: true,
                note: res,
                // titleNote: "Send coin"
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
            <Grid container direction="column" justify="center" alignItems="center" spacing={3} style={{ height: "25%", width: "80%" }}>
                <Grid item>
                    <Paper component="form" variant="outlined" style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                    }}>
                        <Typography style={{ padding: 14, fontSize: 13, width: 100, backgroundColor: "rgba(0, 0, 0, 0.1)", textTransform: 'uppercase', textAlign: 'center' }}>Your address</Typography>
                        <InputBase
                            onChange={(event) => { this.setState({ fromAddress: event.target.value }); }}
                            style={{
                                marginLeft: 10,
                                flex: 1,
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper component="form" variant="outlined" style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                    }}>
                        <Typography style={{ padding: 14, fontSize: 13, width: 100, backgroundColor: "rgba(0, 0, 0, 0.1)", textTransform: 'uppercase', textAlign: 'center' }}>Your privateKey</Typography>
                        <InputBase
                            onChange={(event) => { this.setState({ fromPrivatekey: event.target.value }); }}
                            style={{
                                marginLeft: 10,
                                flex: 1,
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper component="form" variant="outlined" style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                    }}>
                        <Typography style={{ padding: 14, fontSize: 13, width: 100, backgroundColor: "rgba(0, 0, 0, 0.1)", textTransform: 'uppercase', textAlign: 'center' }}>Your ID</Typography>
                        <InputBase
                            onChange={(event) => { this.setState({ id: event.target.value }); }}
                            style={{
                                marginLeft: 10,
                                flex: 1,
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid >
        )
    };

    RenderUser(user, index) {
        return (
            <Card key={index} variant="outlined" style={{ width: "22%", margin: '1%', borderRadius: 10, boxShadow: "8px 12px 10px 0px rgba(0, 0, 0, 0.1)" }} >
                <CardContent>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <img style={{ height: 70, width: 70, borderRadius: '50%', objectFit: 'scale-down' }} src={Avatar} alt="avatar" />
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="center" style={{ height: "100%" }}>
                                <Typography style={{ fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>{user.name}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                <Typography style={{ fontSize: 17, color: "#02446F", marginRight: 10, marginTop: 5 }}> &nbsp;{this.state.MyCoin.getBalanceOfAddress(user.publicKey)}</Typography>
                                <img style={{ width: 25, height: 25 }} src={Ballot} alt="Ticket" />
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <Button style={{ color: "#d4145a" }} onClick={() => this.getTransHisUser(user.publicKey)}>
                                Detail
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button style={{ color: "#d4145a" }} onClick={() => this.handleClickOpenAdd( user.name)}>
                                Vote
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        )
    };

    renderListUsers = () => {
        const users = Listcadidates;

        return (
            <>
                <Grid container direction="row" alignItems="center" justify="center" style={{ borderRadius: 35, marginBottom: 10 }}>
                    {users.map((user, index) => this.RenderUser(user, index))}
                </Grid>
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

    RenderTransactionHis(transaction, publicKey) {
        return (
            <Grid container direction="column" style={{ paddingRight: "1%", paddingLeft: "1%", height: "25%", width: "94%", marginLeft: "3%", marginRight: "3%", marginBottom: 10, border: "1px solid #c4c2c2" }}>
                {publicKey === transaction.fromAddress ?
                    (<Grid item container direction="row" >
                        <Grid item xs={3} >
                            <p style={{ fontSize: 17, fontWeight: 900 }}>Send to :</p>
                        </Grid>
                        <Grid item xs={9} >
                            <InputBase eld id="input" defaultValue={transaction.toAddress}
                                disabled={true}
                                InputProps={{
                                    'aria-label': 'naked',
                                }}
                                style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "2%" }}
                            />
                        </Grid>
                    </Grid>) :
                    (<Grid item container direction="row">
                        <Grid item xs={3}>
                            <p style={{ fontSize: 17, fontWeight: 900 }}>Receive from :</p>
                        </Grid>
                        <Grid item xs={9} >
                            <InputBase id="input" defaultValue={transaction.fromAddress}
                                disabled={true}
                                InputProps={{
                                    'aria-label': 'naked',
                                }}
                                style={{ fontSize: 13, color: "#43a047", width: "100%", marginTop: "2%" }}
                            />
                        </Grid>
                    </Grid>
                    )
                }

                <Grid item container direction="row">
                    <Grid item xs={3} style={{ marginTop: 9 }}>
                        <MonetizationOnTwoToneIcon style={{ color: '#fcb20d' }} />
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

    render() {
        return (
            <>
                <Grid container direction="row" justify="flex-start"
                    alignItems="flex-start">
                    <Grid item container direction="column" alignItems="center" style={{ height: "100%", width: "100%", padding: "0% 2.5%", margin: "auto", marginTop: '4%' }}>
                        <Typography style={{ fontSize: 30, fontWeight: "bold", textAlign: "left", marginLeft: 10, textTransform: 'uppercase' }}>Candidates</Typography>
                        {this.renderListUsers()}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            style={{ width: 250, borderRadius: 50, height: 60, marginBottom: 10, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                            onClick={() => this.AddWallet()}
                        >
                            Add Wallet
                            </Button>
                    </Grid>
                </Grid>
                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={this.state.IsOpenAdd}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">{this.state.toAddress}</DialogTitle>
                    <DialogContent style={{}}>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container justify="center" alignItems="center">
                                {this.renderSendCoin()}
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.send()} style={{ color: '#d4145a' }}>
                            Vote
          </Button>
                        <Button onClick={() => this.handleCloseAdd()} style={{ color: '#d4145a' }}>
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
                <Dialog
                    fullWidth={true}
                    maxWidth="md"
                    open={this.state.IsOpenTransHis}
                    onClose={this.handleCloseTransHis}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">Transactions history</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.transHis[0] ?
                                (this.state.transHis.map((tran, index) => this.RenderTransactionHis(tran, this.state.searchText))) : "No transactions history"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCloseTransHis()} color="primary" autoFocus>
                            Cancel
          </Button>
                    </DialogActions>
                </Dialog>

            </>
        )
    }
};



export default Home;
