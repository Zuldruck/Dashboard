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

export default class App extends Component {
    render() {
        return (
            <Router>
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

