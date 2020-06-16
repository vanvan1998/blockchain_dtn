import React from 'react';
import '../App.css';
import {
    Grid,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    Button,
    AppBar,
    Toolbar,
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
import Data from '../js/data.json';
import User from '../js/user.json';
import { ec as EC } from 'elliptic';
import { reactLocalStorage } from 'reactjs-localstorage';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/Search';

const { Blockchain } = require('../../src/js/blockchain');
const key = '04729aaee497f99ff7ed4da9b7a5c23912da6533783b5cee16839b1e2628bc3413672b407a68c7a15a6fe3ea238b16f26e7a35755e258a0b9fb3d007da7a2e9c94';
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

    handleClose = () => {
        this.setState({
            IsOpenMine: false
        });
    };

    handleCloseSuccess = () => {
        this.setState({
            IsOpenSuccess: false
        });
    };

    handleClickOpen = (publicKey) => {
        this.setState({
            IsOpenMine: true,
            publicKeyMine: publicKey
        });
    };

    mine = () => {
        this.setState({
            mining: true
        });
        setTimeout(() => {
            const res = this.state.MyCoin.minePendingTransactions(key);
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

    renderListPendingTransactions = (trans) => {
        return (
            <>
                {trans.map((tran, index) => this.RenderTransaction(tran))}
                {this.state.mining ? <LinearProgress color="secondary" /> : null}
            </>
        );
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
                                <Button variant="contained"
                                    style={{ width: "100%", height: '57%', borderRadius: 20, background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", color: "white" }}
                                    onClick={() => this.handleClickOpen(user.publicKey)}>
                                    Mine
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

    render() {
        return (
            <>
                <AppBar position="static" style={{ flexGrow: 1, backgroundColor: "#43a047" }}>
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            BLOCK CHAIN
            </Typography>
                        <Grid style={{ flexGrow: 1, width: "40%" }} spacing={1} alignItems="flex-end">
                            <Grid container direction={'row'}>
                                <Grid item xs={10}>
                                    <TextField fullWidth={true} id="input-with-icon-grid" InputProps={{
                                        style: {
                                            color: "white",
                                        }
                                    }}
                                        placeholder="Search transactions of address"
                                        onChange={(event) => { this.setState({ searchText: event.target.value }) }} />
                                </Grid>
                                <Grid item >
                                    <Button onClick={() => { this.getTransHisUser(this.state.searchText) }}>
                                        <SearchIcon style={{ color: "white" }} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid container direction="row" justify="center"
                    alignItems="flex-start" style={{ padding: "1% 2%" }}>
                    <Grid item container direction="column" alignItems="center" style={{ height: "100%", width: "90%", padding: "1.5% 2.5%", margin: "auto" }}>
                        <p style={{ fontSize: 30, fontWeight: "700", textAlign: "left", marginLeft: 10 }}>PEERS</p>
                        {this.renderListUsers()}
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
