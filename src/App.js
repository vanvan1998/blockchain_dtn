import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import Routes from './Routes';
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
  ListItem
} from '@material-ui/core';
import MonetizationOnTwoToneIcon from '@material-ui/icons/MonetizationOnTwoTone';
import Data from './js/data.json';
import { reactLocalStorage } from 'reactjs-localstorage';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ViewListIcon from '@material-ui/icons/ViewList';
import BuildIcon from '@material-ui/icons/Build';

const { Blockchain } = require('../src/js/blockchain');
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
        <AppBar style={{ flexGrow: 1, background: "#d4145a" }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, color: "#fff", fontWeight: 'bold' }}>
              VOTING
            </Typography>
            <Grid style={{ flexGrow: 1 }} spacing={1} >
              <Grid container direction={'row'} justify="flex-end">
                <Grid item >
                  <TextField id="input-with-icon-grid" InputProps={{
                    style: {
                      color: "#fff",
                      borderBottom: '2px solid #fff',
                      width: 300,
                    },
                    disableUnderline: true
                  }
                  }
                    placeholder="Search transactions"
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

        <BrowserRouter>
          <Grid container direction="row" justify="center" alignItems="flex-start" style={{ marginTop: '4%' }}>
            <Grid item xs={2}>
              <Grid container direction="column" justify="flex-start" alignItems="flex-start" style={{ borderRight: '2px solid #dfe3e8', height: window.innerHeight * 0.91 }}>
                <List>
                  <ListItem>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                      <Button variant="container" startIcon={<HomeIcon style={{ color: "#d4145a" }} />} style={{ width: 230, fontWeight: 'bold', fontSize: 15, marginTop: '10%' }}>
                        HOME
                </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to={'/a/block'} style={{ textDecoration: 'none', }}>
                      <Button variant="container" startIcon={<ViewListIcon style={{ color: "#d4145a" }} />} style={{ width: 230, fontWeight: 'bold', fontSize: 15, textAlign: 'left' }}>
                        BLOCK
                </Button>
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link to={'/a/mine'} style={{ textDecoration: 'none' }}>
                      <Button variant="container" startIcon={<BuildIcon style={{ color: "#d4145a" }} />} style={{ width: 230, fontWeight: 'bold', fontSize: 15, textAlign: 'left' }}>
                        MINE
                </Button>
                    </Link>
                  </ListItem>
                </List>


              </Grid>
            </Grid>
            <Grid item xs={10} >
              <Routes />
            </Grid>
          </Grid>
        </BrowserRouter>

      </>
    )
  }
};



export default App;
