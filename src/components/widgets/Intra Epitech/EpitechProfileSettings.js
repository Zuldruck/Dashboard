import React, { Component } from 'react';
import { Checkbox, InputNumber } from 'antd';

export class EpitechProfileSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showGpa: true,
            showPicture: true,
            showPromo: true,
            timer: props.timer || 1,
        }
        if (props.showGpa !== undefined)
            this.state.showGpa = props.showGpa
        if (props.showPromo !== undefined)
            this.state.showPromo = props.showPromo
        if (props.showPicture !== undefined)
            this.state.showPicture = props.showPicture
    }

    onValueChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        }, () => {
            this.props.onValueChange({
                showGpa: this.state.showGpa,
                showPicture: this.state.showPicture,
                showPromo: this.state.showPromo,
                timer: this.state.timer,
            })
        })
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            showGpa: this.state.showGpa,
            showPicture: this.state.showPicture,
            showPromo: this.state.showPromo,
            timer: value
        });
    }

    componentDidMount = () => {
        this.props.onValueChange({
            showGpa: this.state.showGpa,
            showPicture: this.state.showPicture,
            showPromo: this.state.showPromo,
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
                        name="showPicture"
                        onChange={this.onValueChange}
                        checked={this.state.showPicture}
                    >
                        Picture
                    </Checkbox>
                    <Checkbox
                        name="showPromo"
                        onChange={this.onValueChange}
                        checked={this.state.showPromo}
                    >
                        Promo
                    </Checkbox>
                    <Checkbox
                        name="showGpa"
                        onChange={this.onValueChange}
                        checked={this.state.showGpa}
                    >
                        GPA
                    </Checkbox>
                </div>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default EpitechProfileSettings
