import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class Widgets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
        if (localStorage.getItem("access_token") !== null)
            this.state.loggedIn = true
    }

    render() {
        if (!this.state.loggedIn)
            return (
                <Redirect to="/login"/>
            )
        return (
            <div>
                Widgets
            </div>
        )
    }
}

export default Widgets;
