import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'antd'

export class PopularRepo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            language: props.language,
            list: [],
        }
    }

    updateList = (nextLanguage) => {
        axios.post("https://0.0.0.0:5000/services/github/popularRepositories", {
            language: nextLanguage || this.state.language,
            access_token: localStorage.getItem("access_token"),
            sort: 'stars',
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = []

            for (let x in response.data) {
                list.push({
                    repo: response.data[x].name,
                    stars: response.data[x].stars
                })
            }
            this.setState({
                list
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
            this.updateList(nextProps.language)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"Most Stared Repo In " + this.props.language}
                </h2>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item, index) =>
                        <List.Item>
                            <List.Item.Meta 
                                title={
                                    <span style={{...this.props.style, fontSize: 16}}>{(index + 1).toString() + " - " + item.repo}</span>
                                }
                            />
                            <div style={{...this.props.style, fontSize: 16}}>
                                {item.stars}
                            </div>
                        </List.Item>
                    }
                />
            </div>
        )
    }
}

export default PopularRepo;
