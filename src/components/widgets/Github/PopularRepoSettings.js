import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class PopularRepoSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            language: props.language || 'Javascript',
            languages: [{language: "C++"}, {language: "C"}, {language: "Javascript"}],
            timer: props.timer || 1,
        }
    }

    onLanguageChange = (value) => {
        this.setState({
            language: value,
        })
        this.props.onValueChange({
            language: value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            language: this.state.language,
            timer: value
        });
    }

    componentDidMount = () => {
        // Axios.post("https://0.0.0.0:5000/service/github/????", {
        //     access_token: localStorage.getItem("access_token"),
        // }).then(response => {
        //     if (response.status !== 200)
        //         return;
        //     let languages = []

        //     for (let x in response.data) {
        //         languages.push({
        //             language: response.data[x],
        //         })
        //     }
        //     this.setState({
        //         languages,
        //     })
        // })
        this.props.onValueChange({
            language: this.state.language,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Language</h4>
                <Select
                    style={{
                        width: '100%',
                        marginBottom: '5%',
                    }}
                    onChange={this.onLanguageChange}
                    showSearch
                    placeholder="Select a language"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        this.state.languages.map((value, index) => 
                            <Select.Option key={index} value={value.language}>{value.language}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default PopularRepoSettings
