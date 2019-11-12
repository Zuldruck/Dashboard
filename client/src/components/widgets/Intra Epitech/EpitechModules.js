import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'antd'

export class EpitechModules extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            year: props.year,
            list: [],
        }
    }

    updateList = (nextLogin, nextYear) => {
        axios.post("https://0.0.0.0:5000/services/intra/getUserModules", {
            login: nextLogin || this.state.login,
            year: nextYear || this.props.year,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200) {
                this.setState({list: []})                
                return;
            }
            let list = []

            for (let x in response.data) {
                list.push({
                    module: response.data[x].module,
                    grade: response.data[x].grade,
                    credits: response.data[x].credits,
                })
            }
            this.setState({
                list
            })
        });
    }

    componentDidMount = () => {
        this.updateList()

        let interval = setInterval(() => {
            this.updateList()
        }, this.props.timer * 60 * 1000)

        this.setState({interval})
    }
    
    componentWillUnmount = () => { 
        clearInterval(this.state.interval)
    }

    componentWillUpdate = (nextProps) => {
        if (nextProps.login !== this.props.login
        || nextProps.year !== this.props.year) {
            this.updateList(nextProps.login, nextProps.year)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {this.props.login + "'s " + this.props.year + " Modules"}
                </h2>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item) =>
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <span style={{...this.props.style, fontSize: 16}}>{item.module + " - " + item.credits + " credits"}</span>
                                }
                            />
                            <div style={{...this.props.style, fontSize: 16}}>
                                {item.grade}
                            </div>
                        </List.Item>
                    }
                />
            </div>
        )
    }
}

export default EpitechModules;
