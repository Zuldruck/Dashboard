import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class GithubProfileSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            name: '',
            timer: props.timer || 1,
        }
    }

    onNameChange = (value) => {
        this.setState({
            name: value,
        })
        this.props.onValueChange({
            name: value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            name: this.state.name,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/getUserInformations", {
            access_token: localStorage.getItem("access_token")
        }).then(response => {
            if (response.status !== 200)
                return
            Axios.post("https://0.0.0.0:5000/services/github/userFollowers", {
                access_token: localStorage.getItem("access_token"),
                access_token_github: response.data.user.access_token_github,
            }).then(response => {
                if (response.status !== 200)
                    return;
                
                let list = [] 
                
                for (let x in response.data) {
                    list.push({
                        name: response.data[x].name,
                    })
                }
                this.setState({list})
            });
        })
        this.props.onValueChange({
            name: this.state.name,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Follower UserName</h4>
                <Select style={{
                    width: '100%',
                    marginBottom: '5%',
                }} onChange={this.onNameChange}>
                    {
                        this.state.list.map((value, index) => 
                            <Select.Option key={index} value={value.name}>{value.name}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default GithubProfileSettings
