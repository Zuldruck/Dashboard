import React, { Component } from 'react';
import { Table } from 'antd';
import axios from 'axios';

export class TeamsRanking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            league: props.league,
            country: props.country,
            list: [],
            columns: [
                {
                    title: 'Ranking',
                    dataIndex: 'Ranking',
                    key: 'Ranking'
                }, 
                {
                    title: 'Team',
                    dataIndex: 'Team',
                    key: 'Team'
                }, 
                {
                    title: 'Played',
                    dataIndex: 'Played',
                    key: 'Played'
                }, 
                {
                    title: 'Won',
                    dataIndex: 'Won',
                    key: 'Won'
                }, 
                {
                    title: 'Draw',
                    dataIndex: 'Draw',
                    key: 'Draw'
                }, 
                {
                    title: 'Lost',
                    dataIndex: 'Lost',
                    key: 'Lost'
                }
            ]
        }
    }

    updateList = (nextLeague, nextCountry) => {
        console.log(nextLeague || this.state.league)
        console.log(nextCountry || this.state.country)
        axios.post("https://0.0.0.0:5000/services/football/rank", {
            league: nextLeague || this.state.league,
            country: nextCountry || this.state.country,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = [];
            
            for (let x in response.data) {
                list.push({
                    key: list.length.toString(),
                    Ranking: response.data[x].position,
                    Team: response.data[x].name,
                    "Played": response.data[x].match_played,
                    "Won": response.data[x].match_winned,
                    "Draw": response.data[x].match_draw,
                    "Lost": response.data[x].match_loosed,
                })
            }
            this.setState({list})
        });
    }

    componentDidMount = () => {
        this.updateList()
    }

    componentWillUpdate = (nextProps) => {
        if (nextProps !== this.props) {
            this.updateList(nextProps.league, nextProps.country)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"Teams Ranking in " + this.props.league}
                </h2>
                <Table
                    bodyStyle={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}
                    pagination={false}
                    size="small"
                    columns={this.state.columns.map(item => ({ ...item, ellipsis: false }))}
                    dataSource={this.state.list}
                />
            </div>
        )
    }
}

export default TeamsRanking;
