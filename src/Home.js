import React, { Component } from 'react';
import {  } from 'react-router-dom';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        }
    }

    render() {
        return (
            <div>
                Dashboard
            </div>
        )
    }
}

export default Home;
