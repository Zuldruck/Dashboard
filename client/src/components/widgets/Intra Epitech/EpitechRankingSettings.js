import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class EpitechRankingSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            city: props.city || {code: 'FR/MPL', name:'Montpellier'},
            promo: props.promo || 'tek3',
            cities: [],
            timer: props.timer || 1,
            promos: ["tek1", "tek2", "tek3"],
        }
    }

    onCityChange = (value) => {
        const obj = this.state.cities.find((city) => city.code === value)
        
        this.setState({
            city: {code: value, name: obj.city},
        })
        this.props.onValueChange({
            city: {code: value, name: obj.city},
            promo: this.state.promo,
            timer: this.state.timer
        });
    }

    onPromoChange = (value) => {
        this.setState({
            promo: value,
        })
        this.props.onValueChange({
            city: this.state.city,
            promo: value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            city: this.state.city,
            promo: this.state.promo,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/services/intra/listCity", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let cities = []

            for (let x in response.data) {
                cities.push({
                    code: response.data[x],
                    city: x,
                })
            }
            this.setState({
                cities,
            })
        })
        this.props.onValueChange({
            city: this.state.city,
            promo: this.state.promo,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>City</h4>
                <Select
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    onChange={this.onCityChange}
                    placeholder="Select a city"
                    defaultValue={this.state.city.code}
                >
                    {
                        this.state.cities.map((value, index) => 
                            <Select.Option key={index} value={value.code}>{value.city}</Select.Option>
                        )
                    }
                </Select>
                <h4>Promo</h4>
                <Select
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    onChange={this.onPromoChange}
                    placeholder="Select a promo"
                >
                    {
                        this.state.promos.map((value, index) => 
                            <Select.Option key={index} value={value}>{value}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default EpitechRankingSettings
