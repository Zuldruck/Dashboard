import React, { Component } from 'react';
import axios from 'axios';
import { List, Avatar } from 'antd'

export class EpitechBinomes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            list: [],
        }
    }

    updateList = (nextLogin) => {
        axios.post("https://0.0.0.0:5000/services/intra/getUserBinomes", {
            login: nextLogin || this.state.login,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200) {
                this.setState({list: []})                
                return;
            }
            let list = []

            for (let x in response.data) {
                list.push({
                    login: response.data[x].login,
                    picture: response.data[x].picture,
                    projects: response.data[x].projects,
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
        if (nextProps.login !== this.props.login) {
            this.updateList(nextProps.login)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {this.props.login + "'s Top Binomes"}
                </h2>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item, index) =>
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={item.picture} />
                                }
                                title={
                                    <span style={{...this.props.style, fontSize: 16}}>{(index + 1).toString() + " - " + item.login}</span>
                                }
                            />
                            <div style={{...this.props.style, fontSize: 16}}>
                                {item.projects}
                            </div>
                        </List.Item>
                    }
                />
            </div>
        )
    }
}

export default EpitechBinomes;
