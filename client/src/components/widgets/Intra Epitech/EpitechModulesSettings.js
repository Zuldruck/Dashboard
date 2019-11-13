import React, { Component } from 'react';
import { InputNumber, Input } from 'antd';

export class EpitechModulesSettings extends Component {

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
            timer: this.state.timer,
            year: this.state.year,
        });
    }

    onYearChange = (value) => {
        this.setState({
            year: value,
        })
        this.props.onValueChange({
            login: this.state.login,
            timer: this.state.timer,
            year: value,
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            login: this.state.login,
            timer: value,
            year: this.state.year,
        });
    }

    componentDidMount = () => {
        this.props.onValueChange({
            login: this.state.login,
            timer: this.state.timer,
            year: this.state.year,
        })
    }

    render() {
        return (
            <div>
                <h4>Epitech Login</h4>
                <Input style={{
                    width: '100%',
                    marginBottom: '5%',
                }} value={this.state.login} placeholder="Enter your epitech login" onChange={this.onLoginChange}/>
                <h4>Year</h4>
                <InputNumber style={{
                    width: '100%',
                    marginBottom: '5%',
                }} value={this.state.year} placeholder="Enter scolar year" onChange={this.onYearChange}/>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default EpitechModulesSettings
