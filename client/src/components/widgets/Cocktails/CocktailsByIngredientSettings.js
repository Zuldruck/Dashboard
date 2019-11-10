import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
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
        this.props.onValueChange({
            ingredient: this.state.ingredient,
            timer: this.state.timer,
        })
    }

    render() {
        const { autoCompleteList } = this.state;
        return (
            <div>
                <h4>Ingredient</h4>
                <Select
                    onChange={this.onIngredientChange}
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    placeholder="Search for an ingredient"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        autoCompleteList.map((value, index) =>
                            <Select.Option key={index} value={value}>{value}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default CocktailsByIngredientSettings
