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
  Select
} from "@material-ui/core";
import Ticket from "../assets/ticket.png";

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
    isVerfify: false,
    votes: 10,
    candidates: [
      {
        name: "Nguyễn Văn A ",
        publicKey: "0x0abc"
      },
      {
        name: "Nguyễn Văn B ",
        publicKey: "0x0abc"
      }
    ]
  };

  render() {
    const { isVerfify, votes, candidates } = this.state;
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
        style={{ marginTop: "4%" }}
      >
        <Grid item>
          <Typography
            style={{ fontSize: 30, fontWeight: "700", textAlign: "center" }}
          >
            ACCOUNT
          </Typography>
        </Grid>
        {isVerfify ? (
          <>
            <Grid item>
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
                          3217050365
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
                          {votes} votes
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Paper
                component="form"
                variant="outlined"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 400
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
                    // onChange={this.handleChangeAddressReceiver}
                    input={<BootstrapInput />}
                  >
                    <MenuItem value="">
                      <em>Choose candidate</em>
                    </MenuItem>
                    {candidates.map((candidate, index) => {
                      return (
                        <MenuItem key={index} value={candidate.publicKey}>
                          {candidate.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item>
              <Button
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
            <Grid item>
              <Paper
                component="form"
                variant="outlined"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 400
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
                  Your address
                </Typography>
                <InputBase
                  style={{
                    marginLeft: 10,
                    flex: 1
                  }}
                />
              </Paper>
            </Grid>
            <Grid item>
              <Paper
                component="form"
                variant="outlined"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 400
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
                  style={{
                    marginLeft: 10,
                    flex: 1
                  }}
                />
              </Paper>
            </Grid>
            <Grid item>
              <Button
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
      </Grid>
    );
  }
}

export default Account;
