import React, { Component } from 'react'
import './App.css';
import Dashboard from './Dashboard';
import Home from './Home';
import Services from './Services';
import Widgets from './Widgets';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Login from './Login';

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            loggedIn: false,
        }
    }

    render() {
        return (
            <Router>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Dashboard>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/services">
                            <Services />
                        </Route>
                        <Route exact path="/widgets">
                            <Widgets />
                        </Route>
                    </Switch>
                </Dashboard>

            </Router>
        );
    }
}

