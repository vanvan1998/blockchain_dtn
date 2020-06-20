import React from "react";
import "../App.css";
import {
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  InputBase
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import Data from "../js/data.json";
import { reactLocalStorage } from "reactjs-localstorage";
import Ballot from '../assets/ballot.png';
const { Blockchain } = require("../../src/js/blockchain");

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
    searchText: ""
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
  }

  RenderBlock(block, index) {
    return (
      <Grid
        container
        direction="column"
        spacing={2}
        style={{
          height: "25%",
          width: "100%",
          borderWidth: 1,
          borderRadius: 8,
          borderStyle: "outset",
          marginBottom: "5%",
          marginTop: "1%"
        }}
      >
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Typography style={{ fontSize: 18 }}>
              {index === 0 ? "GENESIS BLOCK" : "BLOCK #" + index}
            </Typography>
            <Typography style={{ fontSize: 13 }}>
              Create at {new Date(block.timestamp).toDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography style={{ fontSize: 15 }}>Previous Hash</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography style={{ fontSize: 13, color: "#43a047" }}>
                {block.previousHash}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={3}>
              <Typography style={{ fontSize: 15 }}>Hash</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography style={{ fontSize: 13, color: "#43a047" }}>
                {block.hash}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="flex-end" justify="left">
            <ExpansionPanel
              variant="outlined"
              style={{ height: "25%", width: "100%" }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{fontSize: 15}}>Transactions</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography style={{ height: "25%", width: "100%" }}>
                  {this.renderListTransactions(block)}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  RenderTransaction(transaction, index) {
    return (
      <Grid
        key={index}
        container
        direction="column"
        spacing={2}
        style={{
          height: "25%",
          width: "90%",
          border: "1px solid #c4c2c2"
        }}
      >
        <Grid item >
            <Grid container direction="row" spacing={3}>
                <Grid item xs={3}>
                    <Typography style={{ fontSize: 14 }}>From</Typography>
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
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
        <Grid item >
            <Grid container direction="row">
                <Grid item xs={3}>
                    <Typography style={{ fontSize: 14 }}>To</Typography>
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
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
        <Grid item >
            <Grid container direction="row">
                <Grid item xs={3}>
                    <img style={{ width: 25, height: 25 }} src={Ballot} alt="Ticket" />
                </Grid>
                <Grid item xs={9}>
                    <Typography style={{ fontSize: 13, color: "#43a047" }}>
                        {transaction.amount}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <Grid item >
            <Grid container direction="row">
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
      </Grid>
    );
  }

  renderListBlocks = () => {
    const blocks = this.state.MyCoin.chain;
    return <>{blocks.map((block, index) => this.RenderBlock(block, index))}</>;
  };

  renderListTransactions = block => {
    const trans = block.transactions;
    return (
      <Grid container direction="column" justify="center" alignItems="center">
          {trans.map((tran, index) => this.RenderTransaction(tran, index))}
      </Grid>
    );
  };

  render() {
    return (
      <>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid
            item
            container
            direction="column"
            style={{
              height: "100%",
              width: "90%",
              padding: "0% 2.5%",
              margin: "auto",
              marginTop: "4%"
            }}
          >
            <Typography
              style={{ fontSize: 30, fontWeight: "700", textAlign: "center" }}
            >
              VOTING HISTORY
            </Typography>
            {this.renderListBlocks()}
          </Grid>
        </Grid>
      </>
    );
  }
}

export default Block;
