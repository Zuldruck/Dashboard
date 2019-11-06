import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import TwitterLogin from 'react-twitter-auth';
import SpotifyLogin from 'react-spotify-login';

class ServiceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '',
            icon: '',
            title: '',
        }

        const types = [{
            type: 'spotify',
            color: '#1DB954',
            title: 'Spotify',
            icon: 'spotify.svg',
        }, {
            type: 'epitech',
            color: '#0F6AB3',
            title: 'Intranet Epitech',
            icon: 'epitech.svg'
        }, {
            type: 'football',
            color: '#608038',
            title: 'Football',
            icon: 'football.svg'
        }, {
            type: 'open_data',
            color: '#73468D',
            title: 'Montpellier Open Data',
            icon: 'montpellier.svg'
        }, {
            type: 'twitter',
            color: '#1DA1F2',
            title: 'Twitter',
            icon: 'twitter.svg'
        }, {
            type: 'outlook',
            color: '#0378D4',
            title: 'Outlook',
            icon: 'outlook.svg'
        }, {
            type: 'cocktail',
            color: '#FF8C00',
            title: 'Cocktails',
            icon: 'cocktail.svg'
        }];

        const type = types.find((value) => {
            return value.type === this.props.type;
        });

        this.state.color = type.color;
        this.state.title = type.title;
        this.state.icon = type.icon;
    }

    render() {
        return (
            <div
                className="serviceCard"
                style={{
                    backgroundColor: this.state.color,
                }}
            >
                <div style={{
                    display: 'flex',
                    position: 'relative',
                }}>
                    <ReactSVG src={this.state.icon} style={{
                        paddingLeft: '30px',
                        paddingTop: '15px',
                    }}/>
                    <div style={{
                        position: 'relative',
                        paddingLeft: '10%',
                    }}>
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-40%)',
                            fontWeight: 'bold',
                            fontSize: '24px',
                            lineHeight: 1,
                        }}>
                            {this.state.title}
                        </span>
                    </div>
                    <div className="serviceCardAddButton">
                        {
                            this.props.type === 'spotify' && !this.props.subscribed ?
                            <SpotifyLogin 
                                clientId="50cbf128edfa408db0ecff0298802b5f"
                                redirectUri="https://localhost:3000"
                                onSuccess={response => {
                                    console.log(response)
                                }}
                                onFailure={response => {
                                    console.log(response)
                                }}><ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"}/></SpotifyLogin> :
                            this.props.type === 'twitter' && !this.props.subscribed ?
                            <TwitterLogin
                                loginUrl="http://localhost:4000/api/v1/auth/twitter"
                                onFailure={response => {
                                    console.log(response)
                                }}
                                onSuccess={response => {
                                    console.log(response)
                                }}
                                requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"
                            >
                                <ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"}/>
                            </TwitterLogin> : <ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"} onClick={this.props.onClick}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceCard;
