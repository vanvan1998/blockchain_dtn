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
    isVerify: false,
    votes: 10,
    id: '',
    publicKey: '',
    privateKey: '',
    candidates: Listcadidates,
    candidate: '',
    mining: false,
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

  handleCloseSuccess = () => {
    this.setState({
      mining: false
    });
  };

  verifyAccount = () => {
    //định danh account
    this.setState({
      isVerfify: true,
      votes: this.state.MyCoin.getBalanceOfAddress(this.state.publicKey)
    })

  }

  send = () => {
    // thiếu bước xác thực
    const tx1 = new Transaction(this.state.publicKey, this.state.candidate, 1);
    const privateKey = ec.keyFromPrivate(this.state.privateKey);
    tx1.signTransaction(privateKey);
    const res = this.state.MyCoin.addTransaction(tx1);
    if (res === 'send coin success') {
      this.mine();
    }
    else {
      this.setState({
        note: res,
      });
    }
    var json = JSON.stringify(this.state.MyCoin);
    reactLocalStorage.set('Data', json);
  };

  mine = () => {
    setTimeout(() => {
      const res = this.state.MyCoin.minePendingTransactions();
      var json = JSON.stringify(this.state.MyCoin);
      reactLocalStorage.set('Data', json);
      if (res === 'Block successfully mined!') {
        this.setState({
          mining: true,
          note: 'Vote successfull!',
          titleNote: "Vote",
          votes: this.state.MyCoin.getBalanceOfAddress(this.state.publicKey)
        });
      }
    }, 500);
  };

  render() {
    const { isVerfify, votes, candidates } = this.state;
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
            ACCOUNT
          </Typography>
        </Grid>
        {isVerfify ? (
          <>
            <Grid item style={{ marginBottom: 20 }}>
              <Card variant="outlined">
                <CardContent style={{ width: 300 }}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="space-between"
                        style={{ width: 150 }}
                      >
                        <Typography style={{ textAlign: "center" }}>
                          ID:
                        </Typography>
                        <Typography style={{ textAlign: "center" }}>
                          {this.state.id}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="space-between"
                        style={{ width: 150 }}
                      >
                        <img
                          alt="Ticket"
                          src={Ticket}
                          style={{ height: 25, width: 25 }}
                        />
                        <Typography style={{ textAlign: "left", width: 70 }}>
                          {this.state.votes} votes
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
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
                    padding: 12,
                    fontSize: 13,
                    width: 100,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    textTransform: "uppercase",
                    textAlign: "center"
                  }}
                >
                  Candidate
                </Typography>
                <FormControl style={{ flex: 1 }}>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    // value={receiverAddress}
                    onChange={(event) => { this.setState({ candidate: event.target.value }) }}
                    input={<BootstrapInput />}
                  >
                    <MenuItem value="">
                      <em>Choose candidate</em>
                    </MenuItem>
                    {candidates.map((candidate, index) => {
                      return (
                        <MenuItem key={index} value={candidate.publicKey}>
                          {candidate.publicKey}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item style={{ marginBottom: 20 }}>
              <Button
                onClick={() => this.send()}
                disabled={votes > 0 ? false : true}
                style={
                  votes > 0
                    ? {
                      background:
                        "-webkit-gradient(linear,left top,right top,from(#dd2476),to(#ff512f))",
                      color: "#fff",
                      borderRadius: 50,
                      width: 100
                    }
                    : {
                      backgroundColor: "#d4d4d4",
                      color: "#fff",
                      borderRadius: 50,
                      width: 100
                    }
                }
              >
                Vote
              </Button>
            </Grid>
          </>
        ) : (
            <>
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
                    Your public key
                </Typography>
                  <InputBase
                    onChange={(event) => { this.setState({ publicKey: event.target.value }) }}
                    style={{
                      marginLeft: 10,
                      flex: 1
                    }}
                  />
                </Paper>
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
                    Your private key
                </Typography>
                  <InputBase
                    onChange={(event) => { this.setState({ privateKey: event.target.value }) }}
                    style={{
                      marginLeft: 10,
                      flex: 1
                    }}
                  />
                </Paper>
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
                  onClick={() => this.verifyAccount()}
                  style={{
                    background:
                      "-webkit-gradient(linear,left top,right top,from(#dd2476),to(#ff512f))",
                    color: "#fff",
                    borderRadius: 50,
                    width: 150
                  }}
                >
                  Verify account
              </Button>
              </Grid>
            </>
          )}

        <Dialog
          fullWidth={true}
          maxWidth="xs"
          open={this.state.mining}
          onClose={this.handleCloseSuccess}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Voting</DialogTitle>
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
      </Grid>
    );
  }
}

export default Account;
