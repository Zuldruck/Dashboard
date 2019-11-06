import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';
import ReactSVG from 'react-svg';
import GitHubLogin from 'react-github-login';
import SpotifyLogin from 'react-spotify-login';
import axios from 'axios';
import { msalInstance } from '../msal';
import * as qs from 'querystring';

class ServiceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '',
            icon: '',
            title: '',
            autologinEpitech: '',
            modalEpitechVisible: false,
            access_token: this.props.access_token,
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
            type: 'github',
            color: '#24292E',
            title: 'Github',
            icon: 'github.svg'
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

    handleEpitechModalOk = () => {
        axios.post("https://0.0.0.0:5000/setEpitechAutologin", {
            autologin: this.state.autologinEpitech,
            access_token: this.state.access_token,
        }).then(response => {
            if (response.status !== 200) {
                message.error(response.data.message);
                return;
            }
            this.props.onClick();
        }).catch(error => {
            message.error("An error occured, please retry.")
        });
        this.setState({
            modalEpitechVisible: false,
        });
    }

    requestMicrosoftAccesToken = () => {
        msalInstance.acquireTokenSilent({scopes: ["user.read"]}).then(response => {
            console.log(response.accessToken)
            //call backend to store the access_token
            this.props.onClick();
        })
    }

    onSuccessGithub = (response) => {
        axios.post("https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token", {
            client_id: "Iv1.3cb565ed2a57480d",
            client_secret: "3d0710233c8a5d88aac5e848b86e4a3ccd2070d5",
            code: response.code,
        }).then(response => {
            if (response.status !== 200) {
                message.error("An error occured, please retry.");
                return;
            }
            console.log(qs.parse(response.data).access_token)
            //call backend to store the access_token
            this.props.onClick();
        }).catch(response => {
            message.error("An error occured, please retry.");
        })
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
                                    console.log(response.access_token)
                                     //call backend to store the access_token
                                     this.props.onClick();
                                }}
                                onFailure={() => {
                                    message.error("An error occured, please retry.");
                                }}><ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"}/></SpotifyLogin> :
                            this.props.type === 'github' && !this.props.subscribed ?
                            <GitHubLogin clientId="Iv1.3cb565ed2a57480d"
                                redirectUri="https://localhost:3000"
                                onSuccess={this.onSuccessGithub}
                                onFailure={() => {message.error("An error occured, please retry.")}}
                            ><ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"}/></GitHubLogin> : 
                            this.props.type === 'epitech' && !this.props.subscribed ?
                            <div>
                                <ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"} onClick={() => this.setState({modalEpitechVisible: true})}/>
                                <Modal
                                    title="Basic Modal"
                                    visible={this.state.modalEpitechVisible}
                                    onOk={this.handleEpitechModalOk}
                                    onCancel={() => this.setState({modalEpitechVisible: false})}
                                >
                                    <h4>Enter your Epitech Intranet autologin :</h4>
                                    <br/>
                                    <Input placeholder="Autologin" value={this.state.autologinEpitech} onChange={(event) => this.setState({autologinEpitech: event.target.value})}/>
                                </Modal>
                            </div> :
                            this.props.type === 'outlook' && !this.props.subscribed ?
                            <ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"} onClick={() => msalInstance.loginPopup({scopes: ["user.read"]})
                                .then(response => {
                                    this.requestMicrosoftAccesToken()
                                    this.props.onClick();
                                })
                                .catch(err => {
                                    message.error("An error occured, please retry.");                                    
                                })}/> :
                            <ReactSVG src={this.props.subscribed ? "remove.svg" : "add.svg"} onClick={this.props.onClick}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceCard;