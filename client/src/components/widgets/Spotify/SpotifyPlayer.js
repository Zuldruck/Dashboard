import React, { Component } from 'react';

export class SpotifyPlayer extends Component {

    componentDidMount = () => {
        setInterval(() => {
            this.forceUpdate()
        }, this.props.timer * 60 * 1000)
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    Spotify Player
                </h2>
                <div style={{
                    textAlign: 'center'
                }}>
                    <iframe
                        title={"Spotify Player"}
                        src={"https://open.spotify.com/embed/playlist/" + this.props.playlist}
                        width="300"
                        height="80"
                        frameBorder="0"
                        allowTransparency="true" />
                </div>
            </div>
        )
    }
}

export default SpotifyPlayer;
