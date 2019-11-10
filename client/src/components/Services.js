import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { Row, Col, message } from 'antd';
import axios from 'axios';

export class Services extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            possibleCards: ["twitter", "football", "cocktail", "outlook", "spotify", "epitech", "open_data"],
            subscribedCards: [],
            nonSubscribedCards: [],
            access_token: '',
        }
        const access_token = localStorage.getItem("access_token");

        if (access_token === null)
            return;

        this.state.loggedIn = true;
        this.state.access_token = access_token;
    }

    setSubscribedCards = () => {
        axios.post("https://0.0.0.0:5000/getSubscribedServices", {
            access_token: this.state.access_token,
        }).then(response => {
            let sub = [];
            let nonSub = [];

            console.log(response)

            if (response.status !== 200) {
                message.error(response.data.message);
                return;
            }
            for (let x in response.data.services) {
                if (response.data.services[x])
                    sub.push(x);
                else
                    nonSub.push(x);
            }
            this.setState({
                subscribedCards: [],
                nonSubscribedCards: [],
            })
            this.setState({
                subscribedCards: sub.slice(),
                nonSubscribedCards: nonSub.slice(),
            })
        }).catch(error => {
            message.error("An error occured, please retry.");
        });
    }

    addSubscribedService = (service) => {
        axios.post("https://0.0.0.0:5000/addSubscribedService", {
            service,
            access_token: this.state.access_token,
        }).then(response => {
            if (response.status !== 200) {
                message.error(response.data.message);
                return;
            }
            this.setSubscribedCards();
        }).catch(error => {
            message.error("An error occured, please retry.");
        });
    }

    removeSubscribedService = (service) => {
        axios.post("https://0.0.0.0:5000/removeSubscribedService", {
            service,
            access_token: this.state.access_token,
        }).then(response => {
            if (response.status !== 200) {
                message.error(response.data.message);
                return;
            }
            message.success(service + " services Removed.")
            this.setSubscribedCards();
        }).catch(error => {
            message.error("An error occured, please retry.");
        });
    }

    componentDidMount = () => {
        this.setSubscribedCards();
    }

    render() {
        if (!this.state.loggedIn)
            return (
                <Redirect to="/login"/>
            )
        return (
            <div>
                {this.state.subscribedCards.length !== 0 ? <Row><Col span={21} offset={1} style={{fontSize: 24, marginBottom: '4vh', marginTop: '4vh'}}>Subscribed Services</Col></Row> : ''}
                <Row style={{
                    marginBottom: this.state.subscribedCards.length !== 0 ? '4vh' : '0'
                }}>
                    {
                        this.state.subscribedCards.map((value, index) => {
                            return <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8}>
                                <div style={{
                                    margin: '2%',
                                }}>
                                    <ServiceCard addButton access_token={this.state.access_token} subscribed={true} type={value} onClick={() => {this.removeSubscribedService(value)}} />
                                </div>

                            </Col>
                        })
                    }
                </Row>
                {this.state.nonSubscribedCards.length !== 0 ? <Row><Col span={21} offset={1} style={{fontSize: 24, marginBottom: '4vh', marginTop: '4vh'}}>Non Subscribed Services</Col></Row> : ''}
                <Row style={{
                    marginBottom: '4vh'
                }}>
                    {
                        this.state.nonSubscribedCards.map((value, index) => {
                            return <Col key={index} xs={24} sm={24} md={12} lg={8} xl={8}>
                                <div style={{
                                    margin: '2%',
                                }}>
                                    <ServiceCard addButton access_token={this.state.access_token} subscribed={false} type={value} onClick={() => {this.addSubscribedService(value)}} />
                                </div>

                            </Col>
                        })
                    }

                </Row>
            </div>
        )
    }
}

export default Services;
