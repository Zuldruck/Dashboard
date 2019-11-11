import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'antd'

export class EpitechRanking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            promo: props.promo,
            city: props.city,
            list: [],
            loading: false,
        }
    }

    updateList = (nextCity, nextPromo) => {
        this.setState({
            loading: true,
        })
        axios.post("https://0.0.0.0:5000/services/intra/ranking", {
            city: nextCity ? nextCity.code : this.state.city.code,
            year: nextPromo || this.state.promo,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = []

            for (let x in response.data) {
                list.push({
                    name: response.data[x].user,
                    gpa: response.data[x].gpa
                })
            }
            this.setState({
                list,
                loading: false,
            })
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
            this.updateList(nextProps.city, nextProps.promo)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {this.props.promo + " GPA Ranking in " + this.props.city.name}
                </h2>
                {
                    this.state.loading ?
                    <div className="sk-circle">
                        <div className="sk-circle1 sk-child"></div>
                        <div className="sk-circle2 sk-child"></div>
                        <div className="sk-circle3 sk-child"></div>
                        <div className="sk-circle4 sk-child"></div>
                        <div className="sk-circle5 sk-child"></div>
                        <div className="sk-circle6 sk-child"></div>
                        <div className="sk-circle7 sk-child"></div>
                        <div className="sk-circle8 sk-child"></div>
                        <div className="sk-circle9 sk-child"></div>
                        <div className="sk-circle10 sk-child"></div>
                        <div className="sk-circle11 sk-child"></div>
                        <div className="sk-circle12 sk-child"></div>
                    </div> 
                    : ''
                }
                {
                !this.state.loading ?
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item, index) =>
                        <List.Item>
                            <List.Item.Meta 
                                title={
                                    <span style={{...this.props.style, fontSize: 16}}>{(index + 1).toString() + " - " + item.name}</span>
                                }
                            />
                            <div style={{...this.props.style, fontSize: 16}}>
                                {item.gpa}
                            </div>
                        </List.Item>
                    }
                /> : ''}
            </div>
        )
    }
}

export default EpitechRanking;
