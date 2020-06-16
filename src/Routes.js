import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Block from './pages/block';
import Home from "./pages/home";
import Mine from "./pages/mine";

// Views

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    component={Home}
                />
                <Route
                    exact
                    path="/:id/block"
                    component={Block}
                />
                <Route
                    exact
                    path="/:id/mine"
                    component={Mine}
                />
            </Switch>
        );
    }
}
