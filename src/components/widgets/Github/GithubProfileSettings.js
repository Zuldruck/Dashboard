import React, { Component } from 'react';
import { Checkbox, InputNumber } from 'antd';

export class GithubProfileSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showBio: true,
            showName: true,
            showFollowing: true,
            showFollowers: true,
            timer: props.timer || 1,
        }
        if (props.showBio !== undefined)
            this.state.showBio = props.showBio
        if (props.showName !== undefined)
            this.state.showName = props.showName
        if (props.showFollowers !== undefined)
            this.state.showFollowers = props.showFollowers
        if (props.showFollowing !== undefined)
            this.state.showFollowing = props.showFollowing
    }

    onValueChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        }, () => {
            this.props.onValueChange({
                showBio: this.state.showBio,
                showName: this.state.showName,
                showFollowing: this.state.showFollowing,
                showFollowers: this.state.showFollowers,
                timer: this.state.timer,
            })
        })
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            showBio: this.state.showBio,
            showName: this.state.showName,
            showFollowing: this.state.showFollowing,
            showFollowers: this.state.showFollowers,
            timer: value
        });
    }

    componentDidMount = () => {
        this.props.onValueChange({
            showBio: this.state.showBio,
            showName: this.state.showName,
            showFollowing: this.state.showFollowing,
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
                        name="showFollowing"
                        onChange={this.onValueChange}
                        checked={this.state.showFollowing}
                    >
                        Following
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
                        name="showBio"
                        onChange={this.onValueChange}
                        checked={this.state.showBio}
                    >
                        Bio
                    </Checkbox>
                </div>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default GithubProfileSettings
