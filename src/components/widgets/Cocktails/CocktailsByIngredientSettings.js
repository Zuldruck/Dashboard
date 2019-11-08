import React, { Component } from 'react';
import { AutoComplete, InputNumber } from 'antd';
import Axios from 'axios';

export class CocktailsByIngredientSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ingredient: props.ingredient || '',
            ingredients: [],
            autoCompleteList: [],
            timer: props.timer || 1,
        }
    }

    onIngredientChange = (value) => {
        this.setState({
            ingredient: value,
        })
        this.props.onValueChange({
            ingredient: value,
            timer: this.state.timer
        });
    }

    onSelect = (value) => {
        this.onIngredientChange(value);
    }

    onSearch = (value) => {
        let list = []

        this.state.ingredients.forEach((ingredient, index) => {
            if (ingredient.toLowerCase().startsWith(value.toLowerCase()))
                list.push(ingredient)
        })
        this.setState({
            autoCompleteList: list,
        })
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            ingredient: this.state.ingredient,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/services/cocktail/listIngredients", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            this.setState({
                ingredients: response.data,
                autoCompleteList: response.data,
            })
        })
    }

    render() {
        const { ingredient, autoCompleteList } = this.state;
        return (
            <div>
                <h4>Ingredient</h4>
                <AutoComplete
                    value={ingredient}
                    dataSource={autoCompleteList}
                    onSelect={this.onSelect}
                    onSearch={this.onSearch}
                    onChange={this.onIngredientChange}
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    placeholder="Search for an ingredient"
                />
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default CocktailsByIngredientSettings
