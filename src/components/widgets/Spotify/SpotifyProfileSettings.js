import React, { Component } from 'react';
import { Checkbox, InputNumber } from 'antd';

export class SpotifyProfileSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showCountry: true,
            showName: true,
            showUserId: true,
            showFollowers: true,
            timer: props.timer || 1,
        }
        if (props.showCountry !== undefined)
            this.state.showCountry = props.showCountry
        if (props.showName !== undefined)
            this.state.showName = props.showName
        if (props.showFollowers !== undefined)
            this.state.showFollowers = props.showFollowers
        if (props.showUserId !== undefined)
            this.state.showUserId = props.showUserId
    }

    onValueChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        }, () => {
            this.props.onValueChange({
                showCountry: this.state.showCountry,
                showName: this.state.showName,
                showUserId: this.state.showUserId,
                showFollowers: this.state.showFollowers,
                timer: this.state.timer,
            })
        })
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            showCountry: this.state.showCountry,
            showName: this.state.showName,
            showUserId: this.state.showUserId,
            showFollowers: this.state.showFollowers,
            timer: value
        });
    }

    componentDidMount = () => {
        this.props.onValueChange({
            showCountry: this.state.showCountry,
            showName: this.state.showName,
            showUserId: this.state.showUserId,
            showFollowers: this.state.showFollowers,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Values to Display</h4>
                <div style={{
                    marginBottom: '5%',
                }}>
                    <Checkbox
                        name="showUserId"
                        onChange={this.onValueChange}
                        checked={this.state.showUserId}
                    >
                        UserId
                    </Checkbox>
                    <Checkbox
                        name="showFollowers"
                        onChange={this.onValueChange}
                        checked={this.state.showFollowers}
                    >
                        Followers
                    </Checkbox>
                    <Checkbox
                        name="showName"
                        onChange={this.onValueChange}
                        checked={this.state.showName}
                    >
                        Name
                    </Checkbox>
                    <Checkbox
                        name="showCountry"
                        onChange={this.onValueChange}
                        checked={this.state.showCountry}
                    >
                        Country
                    </Checkbox>
                </div>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default SpotifyProfileSettings
