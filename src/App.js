import React from "react";
import { BrowserRouter, NavLink } from "react-router-dom";
import Routes from "./Routes";
import io from 'socket.io-client';
import Peer from 'peerjs';
import {
  Grid,
  Typography,
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
  List,
  ListItem,
  withStyles
} from "@material-ui/core";
import MonetizationOnTwoToneIcon from "@material-ui/icons/MonetizationOnTwoTone";
import Data from "./js/data.json";
import { reactLocalStorage } from "reactjs-localstorage";
import SearchIcon from "@material-ui/icons/Search";
import HomeIcon from "@material-ui/icons/Home";
import ViewListIcon from "@material-ui/icons/ViewList";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const { Blockchain } = require("../src/js/blockchain");

const styles = theme => ({
  listItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#ededed",
      borderLeft: `4px solid ${"#d4145a"}`,
      borderRadius: "4px",
      "& $listItemIcon": {
        color: "#d4145a",
        marginLeft: "-4px"
      }
    },
    "& + &": {
      marginTop: theme.spacing(1)
    }
  },
  activeListItem: {
    borderLeft: "4px solid #d4145a",
    borderRadius: "4px",
    backgroundColor: "#ededed",
    "& $listItemText": {
      color: theme.palette.text.primary
    },
    "& $listItemIcon": {
      color: "#d4145a",
      marginLeft: "-4px"
    }
  },
  listItemIcon: {
    marginRight: 0
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontSize: 14
  }
});

const Sidebar = withStyles(styles)(props => {
  const { classes } = props;
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      style={{
        borderRight: "2px solid #dfe3e8",
        height: window.innerHeight * 0.91
      }}
    >
      <List style={{ width: "100%", marginTop: '8%', }}>
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/candidates"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="CANDIDATES"
          />
        </ListItem>
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/block"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="VOTING HISTORY"
          />
        </ListItem>

        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/account"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="ACCOUNT"
          />
        </ListItem>
      </List>
    </Grid>
  );
});

class App extends React.Component {
  state = {
    MyCoin: {},
    IsOpenMine: false,
    IsOpenAdd: false,
    IsOpenSuccess: false,
    IsOpenTransHis: false,
    transHis: [],
    toAddress: "",
    fromAddress: "",
    searchText: ""
  };

  socket = io('https://fathomless-beyond-85161.herokuapp.com/');

  peer = new Peer({
    config: {
      'iceServers': [{
        url: 'stun:stun1.l.google.com:19302'
      },
      {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }
      ]
    }
  });

  connections = [];
  connection = null;

  sendMessage = () => {
    this.connections.forEach((conn, index) => {
      conn.send(reactLocalStorage.get("Data"));
    })
  }

  componentWillMount() {
    this.peer.on('open', (id) => {
      console.log(id);
      this.socket.emit('JOIN', id);
    });

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
  }

  componentDidMount() {
    this.socket.on('PEERS', peers => {
      peers.forEach((item, index) => {
        //console.log(index, item.peerId);

        const conn = this.peer.connect(item.peerId);
        conn.on('open', () => {
          conn.send('getData');
        });

        conn.on('data', (data) => {
          if (JSON.parse(data).chain.length < JSON.parse(reactLocalStorage.get("Data")).chain.length) {
            reactLocalStorage.set("isVoted", true);
          }
          else {
            reactLocalStorage.set("Data", data);
          }
        });

        this.connections.push(conn);
      })
    })

    this.peer.on('connection', (conn) => {

      this.connection = conn;
      this.connections.push(conn);

      this.connection.on('data', (data) => {
        if (data !== "getData") {
          if (JSON.parse(data).chain.length < JSON.parse(reactLocalStorage.get("Data")).chain.length) {
            reactLocalStorage.set("isVoted", true);
          }
          else {
            reactLocalStorage.set("Data", data);
          }
        }
      });
      this.connection.on('open', () => {
        this.connection.send(reactLocalStorage.get("Data"));
      });
    });

    // this.peer.on('error', function (err) {
    //   alert('Không thể connect, vui lòng refresh!');
    // });

    setInterval(() => {
      if (reactLocalStorage.get("isVoted") === "true") {
        this.sendMessage();
        reactLocalStorage.set("isVoted", false);
      }
    }, 500)
  }

  handleCloseTransHis = () => {
    this.setState({
      IsOpenTransHis: false
    });
  };

  getTransHisUser = publicKey => {
    const trans = this.state.MyCoin.getTransOfAddress(publicKey);
    this.setState({
      transHis: trans,
      IsOpenTransHis: true,
      searchText: publicKey
    });
  };

  RenderTransaction(transaction) {
    return (
      <Grid
        container
        direction="column"
        style={{
          paddingRight: "1%",
          paddingLeft: "1%",
          height: "25%",
          width: "94%",
          marginLeft: "3%",
          marginRight: "3%",
          marginBottom: 10,
          border: "1px solid #c4c2c2"
        }}
      >
        <Grid item container direction="row">
          <Grid item xs={3}>
            <Typography style={{ fontSize: 14 }}>Sending address</Typography>
          </Grid>
          <Grid item xs={9}>
            <InputBase
              eld
              id="input"
              defaultValue={transaction.fromAddress}
              disabled={true}
              InputProps={{
                "aria-label": "naked"
              }}
              style={{
                fontSize: 13,
                color: "#43a047",
                width: "100%",
                marginTop: "2%"
              }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={3}>
            <Typography style={{ fontSize: 14 }}>Receiving address</Typography>
          </Grid>
          <Grid item xs={9}>
            <InputBase
              id="input"
              defaultValue={transaction.toAddress}
              disabled={true}
              InputProps={{
                "aria-label": "naked"
              }}
              style={{
                fontSize: 13,
                color: "#43a047",
                width: "100%",
                marginTop: "2%"
              }}
            />
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={3} style={{ marginTop: 9 }}>
            <MonetizationOnTwoToneIcon style={{ color: "#fcb20d" }} />
          </Grid>
          <Grid item xs={9}>
            <Typography style={{ fontSize: 13, color: "#43a047" }}>
              {transaction.amount}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={3}>
            <Typography style={{ fontSize: 14 }}>Time</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography style={{ fontSize: 13, color: "#43a047" }}>
              {new Date(transaction.timestamp).toDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  RenderTransactionHis(transaction, publicKey) {
    return (
      <Grid
        container
        direction="column"
        style={{
          paddingRight: "1%",
          paddingLeft: "1%",
          height: "25%",
          width: "94%",
          marginLeft: "3%",
          marginRight: "3%",
          marginBottom: 10,
          border: "1px solid #c4c2c2"
        }}
      >
        {publicKey === transaction.fromAddress ? (
          <Grid item container direction="row">
            <Grid item xs={3}>
              <p style={{ fontSize: 17, fontWeight: 900 }}>Send to :</p>
            </Grid>
            <Grid item xs={9}>
              <InputBase
                eld
                id="input"
                defaultValue={transaction.toAddress}
                disabled={true}
                InputProps={{
                  "aria-label": "naked"
                }}
                style={{
                  fontSize: 13,
                  color: "#43a047",
                  width: "100%",
                  marginTop: "2%"
                }}
              />
            </Grid>
          </Grid>
        ) : (
            <Grid item container direction="row">
              <Grid item xs={3}>
                <p style={{ fontSize: 17, fontWeight: 900 }}>Receive from :</p>
              </Grid>
              <Grid item xs={9}>
                <InputBase
                  id="input"
                  defaultValue={transaction.fromAddress}
                  disabled={true}
                  InputProps={{
                    "aria-label": "naked"
                  }}
                  style={{
                    fontSize: 13,
                    color: "#43a047",
                    width: "100%",
                    marginTop: "2%"
                  }}
                />
              </Grid>
            </Grid>
          )}

        <Grid item container direction="row">
          <Grid item xs={3} style={{ marginTop: 9 }}>
            <MonetizationOnTwoToneIcon style={{ color: "#fcb20d" }} />
          </Grid>
          <Grid item xs={9}>
            <Typography style={{ fontSize: 13, color: "#43a047" }}>
              {transaction.amount}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={3}>
            <Typography style={{ fontSize: 14 }}>Time</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography style={{ fontSize: 13, color: "#43a047" }}>
              {new Date(transaction.timestamp).toDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <>
        <AppBar style={{ flexGrow: 1, background: "#d4145a" }}>
          <Toolbar>
            <Typography
              variant="h6"
              style={{ flexGrow: 1, color: "#fff", fontWeight: "bold" }}
            >
              VOTING
            </Typography>
            <Grid container style={{ flexGrow: 1 }} spacing={1}>
              <Grid container direction={"row"} justify="flex-end">
                <Grid item>
                  <TextField
                    id="input-with-icon-grid"
                    InputProps={{
                      style: {
                        color: "#fff",
                        borderBottom: "2px solid #fff",
                        width: 300
                      },
                      disableUnderline: true
                    }}
                    placeholder="Search transactions"
                    onChange={event => {
                      this.setState({ searchText: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      this.getTransHisUser(this.state.searchText);
                    }}
                  >
                    <SearchIcon style={{ color: "white" }} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={this.state.IsOpenTransHis}
          onClose={this.handleCloseTransHis}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Transactions history
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.transHis[0]
                ? this.state.transHis.map((tran, index) =>
                  this.RenderTransactionHis(tran, this.state.searchText)
                )
                : "No transactions history"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleCloseTransHis()}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <BrowserRouter>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            style={{ marginTop: "4%" }}
          >
            <Grid item xs={2}>
              <Sidebar />
            </Grid>
            <Grid item xs={10}>
              <Routes />
            </Grid>
          </Grid>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
