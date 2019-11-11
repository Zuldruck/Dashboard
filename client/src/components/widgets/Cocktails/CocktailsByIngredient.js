import React, { Component } from 'react';
import { List, Avatar } from 'antd';
import axios from 'axios';

export class CocktailsByIngredient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredient: props.ingredient || 'Vodka',
            list: [],
        }
    }

    updateList = (nextIngredient) => {
        console.log('update list')
        axios.post("https://0.0.0.0:5000/services/cocktail/ingredients", {
            ingredient: nextIngredient || this.state.ingredient,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            let list = [];

            for (let x in response.data) {
                list.push({
                    name: response.data[x].name,
                    picture: response.data[x].picCocktail,
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
            this.updateList(nextProps.ingredient)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"List of Cocktails with " + this.props.ingredient}
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

export default CocktailsByIngredient;
