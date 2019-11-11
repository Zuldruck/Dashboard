import React, { Component } from 'react';
import { List, Row, Col } from 'antd';
import axios from 'axios';

export class LiveScore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            league: props.league,
            country: props.country,
            list: [],
        }
    }

    updateList = (nextLeague, nextCountry) => {
        axios.post("https://0.0.0.0:5000/services/football/live", {
            league: nextLeague || this.state.league,
            country: nextCountry || this.state.country,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = [];
            
            for (let x in response.data) {
                list.push({
                    home: response.data[x].match_hometeam_name,
                    homeScore: response.data[x].match_hometeam_score,
                    away: response.data[x].match_awayteam_name,
                    awayScore: response.data[x].match_awayteam_score,
                })
            }
            this.setState({list})
        });
    }

    componentDidMount = () => {
        this.updateList()

        setInterval(() => {
            this.updateList()
        }, this.props.timer * 60 * 1000)
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
                    {"Live Scores in " + this.props.league}
                </h2>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item) => 
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <Row style={{...this.props.style, fontSize: 16}}>
                                        <Col style={{textAlign: 'center'}} span={8}>
                                            {item.home}
                                        </Col>
                                        <Col style={{textAlign: 'center'}} span={8}>
                                            {item.homeScore + " - " + item.awayScore}
                                        </Col>
                                        <Col style={{textAlign: 'center'}} span={8}>
                                            {item.away}
                                        </Col>
                                    </Row>
                                }
                            />
                        </List.Item>
                    }
                />
            </div>
        )
    }
}

export default LiveScore;
