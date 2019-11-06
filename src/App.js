import React, { Component } from 'react'
import './App.css';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Services from './components/Services';
import Users from './components/Users';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Login from './components/login/Login';
import { connect } from 'react-redux';
import axios from 'axios';
import { adminAction } from './actions';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            isAdmin: props.isAdmin,
        }

        const access_token = localStorage.getItem('access_token')
        if (access_token !== null)
            axios.post('https://0.0.0.0:5000/getUserInformations', {
                'access_token': access_token
            }).then(response => {
                console.log(response)
                if (response.status === 200 && response.data.user.admin)
                    this.props.setAdmin(true);
            }).catch(error => {
                console.log(error)
            });
    }
    
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact component={Login} path="/login" />
                    <Dashboard>
                        <Route exact component={Home} path="/" />
                        <Route exact component={Services} path="/services" />
                        <Route exact component={Users} path="/users" />
                    </Dashboard>
                </Switch>
            </Router>
        );
    }
}

export default connect((state) => {
    return {
        isAdmin: state.isAdmin,
    }
}, (dispatch) => {
    return {
        setAdmin: (isAdmin) => dispatch(adminAction(isAdmin))
    }
})(App);