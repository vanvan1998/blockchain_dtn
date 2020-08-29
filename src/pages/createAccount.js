import React from "react";
import {
  Grid,
  Typography,
  Button,
  InputBase,
  IconButton,
  Paper,
  Card,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Data from "../js/data.json";
import User from "../js/user.json";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Box from "@material-ui/core/Box";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ec as EC } from "elliptic";
const { Blockchain, Transaction } = require("../../src/js/blockchain");
const ec = new EC("secp256k1");

const PopupValue = props => {
  const { value } = props;
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {popupState => (
        <div>
          <Typography
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: 350,
              height: "auto",
              color: "green",
              fontSize: 11
            }}
            {...bindTrigger(popupState)}
          >
            {value}
          </Typography>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <Box p={2}>
              <Typography
                style={{
                  fontSize: 11
                }}
              >
                {value}
              </Typography>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};

class Account extends React.Component {
  state = {
    Users: [],
    MyCoin: {},
    publicKey: "",
    privateKey: "",
    copied: false,
  };

  componentWillMount() {
    if (reactLocalStorage.get("Data")) {
      this.setState({
        MyCoin: new Blockchain(JSON.parse(reactLocalStorage.get("Data")))
      });
    } else {
      reactLocalStorage.set("Data", JSON.stringify(Data));
      this.setState({
        MyCoin: new Blockchain(Data)
      });
    }
    if (reactLocalStorage.get("Users")) {
      this.setState({
        Users: JSON.parse(reactLocalStorage.get("Users"))
      });
    } else {
      reactLocalStorage.set("Users", JSON.stringify(User));
      this.setState({
        Users: User
      });
    }
  }

  AddWallet = () => {
    const key = ec.genKeyPair();
    const privateKey = key.getPrivate("hex");
    const publicKey = key.getPublic("hex");
    var newUsers = this.state.Users;
    newUsers.push({
      name: "Wallet" + (newUsers.length + 1),
      privateKey: privateKey,
      publicKey: publicKey
    });
    this.setState({
      Users: newUsers
    });
    reactLocalStorage.set("Users", JSON.stringify(this.state.Users));
    const rewardTx = new Transaction(null, publicKey, 3);
    this.state.MyCoin.pendingTransactions.push(rewardTx);

    setTimeout(() => {
      const res = this.state.MyCoin.minePendingTransactions();
      var json = JSON.stringify(this.state.MyCoin);
      reactLocalStorage.set("Data", json);
      if (res === "Block successfully mined!") {
        this.setState({
          IsOpenSuccess: true,
          note: "Add successfull!",
          titleNote: "Add "
        });
      }
    }, 500);
    this.setState({
      publicKey: publicKey,
      privateKey: privateKey
    });
    var json = JSON.stringify(this.state.MyCoin);
    reactLocalStorage.set("Data", json);
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
                width: 100,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              Your ID
            </Typography>
            <InputBase
              onChange={event => {
                this.setState({ id: event.target.value });
              }}
              style={{
                marginLeft: 10,
                flex: 1
              }}
            />
          </Paper>
        </Grid>
        {this.state.publicKey && this.state.privateKey && (
          <Grid item style={{ marginBottom: 20 }}>
            <Card variant="outlined" style={{ marginBottom: 20 }}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                spacing={2}
                style={{ width: 500, height: 200 }}
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="space-around"
                  >
                    <Typography
                      style={{
                        fontSize: 12,
                        color: "#000",
                        textTransform: "uppercase"
                      }}
                    >
                      Private key
                    </Typography>
                    <PopupValue value={this.state.privateKey} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="space-around"
                  >
                    <Typography
                      style={{
                        fontSize: 12,
                        color: "#000",
                        textTransform: "uppercase"
                      }}
                    >
                      Public key
                  </Typography>
                    <PopupValue value={this.state.publicKey} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="center"
                    style={{ width: 570 }}>
                    <CopyToClipboard text={`Private key: ${this.state.privateKey}\nPublic key: ${this.state.publicKey}\nID: ${this.state.id}`}
                      onCopy={() => this.setState({ copied: true })}>
                      <IconButton style={{ color: "#dd2476" }}>
                        <FileCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                    {this.state.copied ? <span style={{ color: 'green', fontSize: 12 }}>Copied</span> : null}
                  </Grid>

                </Grid>
              </Grid>
            </Card>
            <Typography style={{ fontSize: 13, color: '#dd2476' }}>You have to remember your private key and public key above because you use it to vote for anyone</Typography>
          </Grid>
        )}
        <Grid item style={{ marginBottom: 20 }}>
          {this.state.publicKey && this.state.privateKey ? (
            <Link to="/account" style={{ textDecoration: "none" }}>
              <Button
                style={{
                  background:
                    "-webkit-gradient(linear,left top,right top,from(#dd2476),to(#ff512f))",
                  color: "#fff",
                  borderRadius: 50,
                  width: "auto"
                }}
              >
                REMIND YOUR ACCOUNT AND LET'S VOTING!
            </Button>
            </Link>

          ) : (
              <Button
                onClick={() => this.AddWallet()}
                style={{
                  background:
                    "-webkit-gradient(linear,left top,right top,from(#dd2476),to(#ff512f))",
                  color: "#fff",
                  borderRadius: 50,
                  width: 200
                }}
              >
                REGISTER ACCOUNT
              </Button>)}

        </Grid>
      </Grid>
    );
  }
}

export default Account;
