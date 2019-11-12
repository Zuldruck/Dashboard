import React, { Component } from 'react';
import axios from 'axios';
import ReactSVG from 'react-svg';

export class SpotifyProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            followers: 0,
            following: 0,
            name: '',
            userId: '',
        }
    }

    updateList = () => {
        axios.post("https://0.0.0.0:5000/getUserInformations", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return
            axios.post("https://0.0.0.0:5000/services/spotify/userInfo", {
                access_token: localStorage.getItem("access_token"),
                accessTokenSpotify: response.data.user.access_token_spotify,
            }).then(response => {
                if (response.status !== 200)
                    return;
                this.setState({
                    name: response.data.name,
                    followers: parseInt(response.data.followers),
                    country: response.data.country,
                    userId: response.data.userId,
                })
            });
        })
    }

    componentDidMount = () => {
        this.updateList()

        let interval = setInterval(() => {
            this.updateList()
        }, this.props.timer * 60 * 1000)

        this.setState({interval})
    }
    
    componentWillUnmount = () => { 
        clearInterval(this.state.interval)
    }

    render() {
        return (
            <div style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
                height: '100%',
            }}>
                <div style={{
                    fontSize: 20,
                }}>
                    <span>
                        {this.props.showName && this.state.name}
                    </span>
                    <br/>
                    <span style={{
                        fontSize: 14,
                    }}>
                        {this.props.showUserId && this.state.userId}
                    </span>
                    <br/>
                    <span style={{
                        fontSize: 14,
                    }}>
                        {this.props.showCountry && this.state.country}
                    </span>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                    <ReactSVG src="spotify.svg"/>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: 1,
                    left: 5,
                }}>
                    <span style={{
                        fontSize: 32
                    }}>
                        {this.props.showFollowers && this.state.followers}
                    </span>
                    {
                        this.props.showFollowers ? 
                        <div style={{
                            marginTop: '5px'
                        }}>Followers</div>
                        : ''
                    }
                </div>
            </div>
        )
    }
}

export default SpotifyProfile;
