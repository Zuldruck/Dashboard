import React, { Component } from 'react';
import { InputNumber, Select } from 'antd';
import Axios from 'axios';

export class CocktailsByGlassSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            glass: props.glass || '',
            timer: props.timer || 1,
            glasses: [],
            autoCompleteList: [],
        }
    }

    onGlassChange = (value) => {
        this.setState({
            glass: value,
        })
        this.props.onValueChange({
            glass: value,
            timer: this.state.timer
        });
    }

    // onSelect = (value) => {
    //     this.onGlassChange(value);
    // }

    // onSearch = (value) => {
    //     let list = []

    //     this.state.glasses.forEach((glass, index) => {
    //         if (glass.toLowerCase().startsWith(value.toLowerCase()))
    //             list.push(glass)
    //     })
    //     this.setState({
    //         autoCompleteList: list,
    //     })
    // }

    onTimerChange = (value) => {
        this.props.onValueChange({
            glass: this.state.glass,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/services/cocktail/listGlasses", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            this.setState({
                glasses: response.data,
                autoCompleteList: response.data,
            })
        })
        this.props.onValueChange({
            glass: this.state.glass,
            timer: this.state.timer,
        })
    }

    render() {
        const { autoCompleteList } = this.state;
        return (
            <div>
                <h4>Glass</h4>
                <Select
                    onChange={this.onGlassChange}
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    placeholder="Search for a glass"
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

export default CocktailsByGlassSettings
