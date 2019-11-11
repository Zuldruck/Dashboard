import React, { Component } from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';

export class CocktailsByGlass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            glass: props.glass || 'Champagne Flute',
            list: [],
        }
    }

    updateList = (nextGlass) => {
        axios.post("https://0.0.0.0:5000/services/cocktail/cocktailGlasses", {
            glass: nextGlass || this.state.glass,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = [];

            for (let x in response.data) {
                list.push({
                    name: response.data[x].name,
                    picture: response.data[x].pic,
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
            this.updateList(nextProps.glass)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"List of Cocktails with " + this.props.glass}
                </h2>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={(item) => {
                        return(
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar size="large" src={item.picture} />}
                                title={
                                    <span style={{...this.props.style, fontSize: 16}}>
                                        {item.name}
                                    </span>
                                }
                            />
                        </List.Item>
                        )
                    }}
                />
            </div>
        )
    }
}

export default CocktailsByGlass;
