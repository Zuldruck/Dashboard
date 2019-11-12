import React, { Component } from 'react';

export class DeezerPlayer extends Component {

    componentDidMount = () => {
        setInterval(() => {
            this.forceUpdate()
        }, this.props.timer * 60 * 1000)
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    Deezer Player
                </h2>
                <div style={{
                    textAlign: 'center'
                }}>
                   <iframe
                        title={"Deezer Player"}
                        scrolling="no"
                        frameborder="0"
                        allowTransparency="true"
                        src={"https://www.deezer.com/plugins/player?format=square&autoplay=false&playlist=false&width=300&height=300&color=ff0000&layout=dark&size=medium&type=playlist&id=" + this.props.playlist + "&app_id=1"}
                        width="300" height="300"
                    />
                </div>
            </div>
        )
    }
}

export default DeezerPlayer;
