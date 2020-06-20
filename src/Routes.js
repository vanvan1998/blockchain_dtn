import React, { Component } from 'react';
import { Switch, Route , Redirect} from 'react-router-dom';
import Block from './pages/block';
import Home from "./pages/home";
// import Mine from "./pages/mine";
import Account from "./pages/account";

// Views

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <Redirect exact from="/" to="/candidates" />
                <Route
                    exact
                    path="/candidates"
                    component={Home}
                />
                <Route
                    exact
                    path="/block"
                    component={Block}
                />
                <Route
                    exact
                    path="/account"
                    component={Account}
                />
            </Switch>
        );
    }
}
