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
    TextField,
    InputBase,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import Data from '../js/data.json';
import { reactLocalStorage } from 'reactjs-localstorage';
import SearchIcon from '@material-ui/icons/Search';

const { Blockchain } = require('../../src/js/blockchain');

class Block extends React.Component {
    state = {
        MyCoin: {},
        IsOpenMine: false,
        IsOpenAdd: false,
        IsOpenSuccess: false,
        IsOpenTransHis: false,
        transHis: [],
        toAddress: "",
        fromAddress: "",
        searchText: "",
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

    RenderBlock(block, index) {
        return (
            <Grid item container direction="column" style={{ height: "25%", width: "100%", padding: "0% 2.5% 2.5% 2.5%", borderWidth: 2, borderRadius: 30, borderStyle: "outset", marginBottom: "5%", marginTop: "1%" }}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <p style={{ fontSize: 20 }}>{index === 0 ? "GENESIS BLOCK" : "BLOCK #" + index}</p>
                        <p style={{ fontSize: 13 }}>Create at {new Date(block.timestamp).toDateString()}</p>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <p style={{ fontSize: 18 }}>Previous Hash</p>
                        <p style={{ fontSize: 18 }}>Hash</p>
                    </Grid>
                    <Grid item xs={9}>
                        <p style={{ fontSize: 16, color: "#43a047" }}>{block.previousHash}</p>
                        <p style={{ fontSize: 16, color: "#43a047" }}>{block.hash}</p>
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="flex-end" justify="left">
                    <ExpansionPanel variant="outlined" style={{ height: "25%", width: "100%" }}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>transactions</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography style={{ height: "25%", width: "100%" }}>
                                {this.renderListTransactions(block)}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
            </Grid>
        );
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

    renderListBlocks = () => {
        const blocks = this.state.MyCoin.chain;
        return (
            <>
                {blocks.map((block, index) => this.RenderBlock(block, index))}
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
                    <Grid item container direction="column" style={{ height: "100%", width: "90%", padding: "1.5% 2.5%", margin: "auto" }}>
                        <p style={{ fontSize: 30, fontWeight: "700", textAlign: "center" }}>BLOCK CHAIN</p>
                        {this.renderListBlocks()}
                    </Grid>
                </Grid>
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



export default Block;
