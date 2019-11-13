import React, { Component } from 'react';
import axios from 'axios';
import ReactSVG from 'react-svg';

export class GithubProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name || '',
        }
    }

    updateList = (nextName) => {
        axios.post("https://0.0.0.0:5000/getUserInformations", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return
            console.log(nextName || this.state.name)
            console.log(nextName)
            console.log(this.state.name)
            axios.post("https://0.0.0.0:5000/services/github/userInfo", {
                access_token: localStorage.getItem("access_token"),
                accessTokenGithub: response.data.user.access_token_github,
                name: nextName || this.state.name,
            }).then(response => {
                if (response.status !== 200)
                    return;
                
                this.setState({
                    followers: parseInt(response.data.followers),
                    following: parseInt(response.data.following),
                    displayedName: response.data.name,
                    bio: response.data.bio,
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

    componentWillUpdate = (nextProps) => {
        console.log(nextProps.name)
        console.log(this.props.name)
        if (nextProps.name !== this.props.name) {
            this.updateList(nextProps.name)
        }
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
                        {this.state.displayedName}
                    </span>
                    <br/>
                    <span style={{
                        fontSize: 14,
                    }}>
                        {this.state.bio}
                    </span>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                    <ReactSVG src="github.svg"/>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: 1,
                    left: 5,
                }}>
                    <span style={{
                        fontSize: 32
                    }}>
                        {this.state.followers}
                    </span>
                        <div style={{
                            marginTop: '5px'
                        }}>
                            Followers
                        </div>
                </div>
                <div style={{
                    textAlign: 'right',
                    position: 'absolute',
                    bottom: 1,
                    right: 5,
                }}>
                    <span style={{
                        fontSize: 32
                    }}>
                        {this.state.following}
                    </span>
                        <div style={{
                            marginTop: '5px'
                        }}>
                            Following
                        </div>
                </div>
            </div>
        )
    }
}

export default GithubProfile;
