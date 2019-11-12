import React, { Component } from 'react';
import { InputNumber, Input } from 'antd';

export class PopularRepoSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: props.login,
            timer: props.timer || 1,
        }
    }

    onLoginChange = (event) => {
        this.setState({
            login: event.target.value,
        })
        this.props.onValueChange({
            login: event.target.value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            login: this.state.login,
            timer: value
        });
    }

    componentDidMount = () => {
        this.props.onValueChange({
            login: this.state.login,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Login</h4>
                <Input style={{
                    width: '100%',
                    marginBottom: '5%',
                }} value={this.state.login} onChange={this.onLoginChange}/>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default PopularRepoSettings
