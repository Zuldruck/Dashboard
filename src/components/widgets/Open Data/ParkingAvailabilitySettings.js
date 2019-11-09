import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class ParkingAvailabilitySettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            park: props.park || 'Comédie',
            parks: [],
            timer: props.timer || 1,
        }
    }

    onParkChange = (value) => {
        this.setState({
            park: value,
        })
        this.props.onValueChange({
            park: value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            park: this.state.park,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/services/openDataMontpellier/listParkings", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let parks = []

            for (let x in response.data) {
                parks.push({
                    park: response.data[x],
                })
            }
            this.setState({
                parks: parks,
            })
        })
        this.props.onValueChange({
            park: this.state.park,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Park</h4>
                <Select defaultValue={this.state.park} style={{
                    width: '100%',
                    marginBottom: '5%',
                }} onChange={this.onParkChange}>
                    {
                        this.state.parks.map((value, index) => 
                            <Select.Option key={index} value={value.park}>{value.park}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default ParkingAvailabilitySettings
