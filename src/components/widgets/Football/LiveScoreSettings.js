import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class LiveScoreSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            league: props.league || 'Ligue 1',
            country: props.country || 'France',
            leagues: [],
            timer: props.timer || 1,
        }
    }

    onLeagueChange = (value) => {
        const league = this.state.leagues.find((league) => league.league === value)

        this.setState({
            league: value,
            country: league.country,
        })
        this.props.onValueChange({
            league: value,
            country: league.country,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            league: this.state.league,
            country: this.state.country,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/services/football/listLeaguesDashboard", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let leagues = []

            for (let x in response.data) {
                leagues.push({
                    country: x,
                    league: response.data[x],
                })
            }
            this.setState({
                leagues: leagues,
            })
        })
        this.props.onValueChange({
            league: this.state.league,
            country: this.state.country,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>League</h4>
                <Select defaultValue={this.state.league} style={{
                    width: '100%',
                    marginBottom: '5%',
                }} onChange={this.onLeagueChange}>
                    {
                        this.state.leagues.map((value, index) => 
                            <Select.Option key={index} value={value.league}>{value.league}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default LiveScoreSettings
