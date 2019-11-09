import React, { Component } from 'react';
import axios from 'axios';

export class SpotifyPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playlists: props.playlists,
            slots: 0,
        }
    }

    updateList = (nextPlaylists) => {
        axios.post("https://0.0.0.0:5000/services/spotify", {
            playlistsing: nextPlaylists || this.state.playlists,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            // this.setState({slots: parseInt(response.data.Free)})
        });
    }

    componentDidMount = () => {
        this.updateList()
    }

    componentWillUpdate = (nextProps) => {
        if (nextProps !== this.props) {
            this.updateList(nextProps.playlists)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"Available Cars Slots in " + this.props.playlists}
                </h2>
                <p style={{
                    ...this.props.style,
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 42,
                    marginBottom: 0,
                }}>
                    {this.state.slots}
                </p>
            </div>
        )
    }
}

export default SpotifyPlayer;
