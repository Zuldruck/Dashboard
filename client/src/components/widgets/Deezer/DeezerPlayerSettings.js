import React, { Component } from 'react';
import { Select, InputNumber } from 'antd';
import Axios from 'axios';

export class DeezerPlayerSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            playlist: '',
            timer: props.timer || 1,
        }
    }

    onPlaylistChange = (value) => {
        console.log(value)
        this.setState({
            playlist: value,
        })
        this.props.onValueChange({
            playlist: value,
            timer: this.state.timer
        });
    }

    onTimerChange = (value) => {
        this.props.onValueChange({
            playlist: this.state.playlist,
            timer: value
        });
    }

    componentDidMount = () => {
        Axios.post("https://0.0.0.0:5000/getUserInformations", {
            access_token: localStorage.getItem("access_token")
        }).then(response => {
            if (response.status !== 200)
                return
            Axios.post("https://0.0.0.0:5000/services/deezer/playlistsUserDeezer", {
                access_token: localStorage.getItem("access_token"),
                accessTokenDeezer: response.data.user.access_token_deezer,
            }).then(response => {
                if (response.status !== 200)
                    return;
                
                let list = [] 
                
                for (let x in response.data) {
                    list.push({
                        name: response.data[x].name,
                        playlistId: response.data[x].playlist_id,
                        imageUrl: response.data[x].image_url,
                    })
                }
                this.setState({list})
            });
        })
        this.props.onValueChange({
            playlist: this.state.playlist,
            timer: this.state.timer,
        })
    }

    render() {
        return (
            <div>
                <h4>Playlist</h4>
                <Select style={{
                    width: '100%',
                    marginBottom: '5%',
                }} onChange={this.onPlaylistChange}>
                    {
                        this.state.list.map((value, index) => 
                            <Select.Option key={index} value={value.playlistId}>{value.name}</Select.Option>
                        )
                    }
                </Select>
                <h4>Timer (in minutes)</h4>
                <InputNumber min={1} max={60} defaultValue={this.state.timer} onChange={this.onTimerChange}/>
            </div>
        )
    }
}

export default DeezerPlayerSettings
