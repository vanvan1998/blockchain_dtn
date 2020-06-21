import React from "react";
import {
    Grid,
    Typography,
    Button,
    InputBase,
    Paper,
    Card,
    CardContent,
    withStyles,
    FormControl,
    MenuItem,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import Ticket from "../assets/ticket.png";
import { reactLocalStorage } from 'reactjs-localstorage';
import Data from '../js/data.json';
import User from '../js/user.json';
import Listcadidates from '../js/listcadidates.json';
import { ec as EC } from 'elliptic';

const { Blockchain, Transaction } = require('../../src/js/blockchain');
const ec = new EC('secp256k1');

const BootstrapInput = withStyles(theme => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3)
        }
    },
    input: {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        fontSize: 12,
        padding: "10px 26px 10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff"
        }
    }
}))(InputBase);

class Account extends React.Component {
    state = {
        Users: [],
        MyCoin: {},
        publicKey:'',
        privateKey:''
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
        const rewardTx = new Transaction(null, publicKey, 3);
        this.state.MyCoin.pendingTransactions.push(rewardTx);
        
        setTimeout(() => {
            const res = this.state.MyCoin.minePendingTransactions();
            var json = JSON.stringify(this.state.MyCoin);
            reactLocalStorage.set('Data', json);
            if (res === 'Block successfully mined!') {
                this.setState({
                    IsOpenSuccess: true,
                    note: 'Add successfull!',
                    titleNote: "Add ",
                });
            }
        }, 500);
        this.setState({
            publicKey: 'Public key: '+publicKey,
            privateKey:'Private key: ' +privateKey
        })
        var json = JSON.stringify(this.state.MyCoin);
        reactLocalStorage.set('Data', json);
    };

    render() {
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ marginTop: "4%" }}
            >
                <Grid item style={{ marginBottom: 20 }}>
                    <Typography
                        style={{ fontSize: 30, fontWeight: "700", textAlign: "center" }}
                    >
                        CREATE ACCOUNT
          </Typography>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                    <Paper
                        component="form"
                        variant="outlined"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: 500
                        }}
                    >
                        <Typography
                            style={{
                                padding: 14,
                                fontSize: 13,
                                width: 150,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                textTransform: "uppercase",
                                textAlign: "center"
                            }}
                        >
                            Your ID
                </Typography>
                        <InputBase
                            onChange={(event) => { this.setState({ id: event.target.value }) }}
                            style={{
                                marginLeft: 10,
                                flex: 1
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                    <Button
                        onClick={() => this.AddWallet()}
                        style={{
                            background:
                                "-webkit-gradient(linear,left top,right top,from(#dd2476),to(#ff512f))",
                            color: "#fff",
                            borderRadius: 50,
                            width: 150
                        }}
                    >
                        Đăng ký
              </Button>
                </Grid>
                <h4>{this.state.publicKey}</h4>
                <h4>{this.state.privateKey}</h4>
            </Grid>
        );
    }
}

export default Account;
