import React, { Component } from 'react';
// import { List, message } from 'antd';
import axios from 'axios';

export class CocktailsByIngredient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredient: props.ingredient,
            list: [],
        }
    }

    componentDidMount = () => {
        axios.post("https://0.0.0.0:5000/services/cocktail/ingredients", {
            ingredient: this.state.ingredient,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            for (let x in response.data) {
                const list = this.state.list;

                list.append({
                    name: x.name,
                    picture: x.picCocktail,
                })
                this.setState({list})
            }
        });
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default CocktailsByIngredient;
