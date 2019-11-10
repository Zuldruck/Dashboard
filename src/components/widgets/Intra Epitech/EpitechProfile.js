import React, { Component } from 'react';
import axios from 'axios';
import ReactSVG from 'react-svg';

export class EpitechProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gpa: 0,
            name: '',
            promo: '',
            picture: '',
        }
        console.log(props)
    }

    updateList = () => {
        axios.post("https://0.0.0.0:5000/getUserInformations", {
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return
            axios.post("https://0.0.0.0:5000/services/intra/userInfo", {
                access_token: localStorage.getItem("access_token"),
                auth_login: response.data.user.intra_autologin,
            }).then(response => {
                if (response.status !== 200)
                    return;
                this.setState({
                    name: response.data.name,
                    gpa: parseFloat(response.data.gpa),
                    promo: response.data.promo,
                    picture: response.data.picture,
                })
            });
        })
    }

    componentDidMount = () => {
        this.updateList()
    }

    componentDidUpdate = () => {
        console.log(this.props)
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
                    {this.props.showPicture ? <div ><img style={{borderRadius: '100%'}} src={this.state.picture} width={75} height={90}/><br/></div> : ''}
                    <span>
                        {this.state.name}
                    </span>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}>
                    <ReactSVG src="epitech.svg"/>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: 1,
                    left: 5,
                }}>
                    <span style={{
                        fontSize: 32
                    }}>
                        {this.props.showPromo && this.state.promo}
                    </span>
                    {
                        this.props.showPromo ? 
                        <div style={{
                            marginTop: '5px'
                        }}>Promo</div>
                        : ''
                    }
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
                        {this.props.showGpa && this.state.gpa}
                    </span>
                    {
                        this.props.showGpa ?
                        <div style={{
                            marginTop: '5px'
                        }}>GPA</div>
                        : ''
                    }
                </div>
            </div>
        )
    }
}

export default EpitechProfile;
