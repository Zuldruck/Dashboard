import React, { Component } from 'react';
import './login.css';
import axios from 'axios';
import { Row, Col, message } from 'antd';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { adminAction } from '../../actions';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
import ReactSVG from 'react-svg';

class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            registerRepeatedPassword: '',
            sliderClass: '',
            isLoading: false,
            loggedIn: false,
        }
        if (localStorage.getItem("access_token") !== null)
            this.state.loggedIn = true
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log('submit')
        this.setState({isLoading: true});

        if (this.state.sliderClass === ''
            || this.state.sliderClass === 'bounceRight') {
            axios.post("https://0.0.0.0:5000/login", {
                login: this.state.loginEmail,
                password: this.state.loginPassword,
            }).then((response) => {
                console.log(response)
                this.setState({isLoading: false});
                if (response.status !== 200) {
                    this.setState({isLoading: false});
                    message.error(response.data.message)
                    return;
                }
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('widgets', null);
                this.props.setAdmin(response.data.is_admin);
                this.props.history.push('/');
            }).catch(error => {
                this.setState({isLoading: false});
                message.error('An error occured, please retry');
            })
        } else {
            if (this.state.registerPassword !== this.state.registerRepeatedPassword) {
                this.setState({isLoading: false});
                message.warning('Passwords do not match', 3);
                return;
            }
            axios.post("https://0.0.0.0:5000/register", {
                login: this.state.registerEmail,
                password: this.state.registerPassword,
                admin: 0,
            }).then((response) => {
                this.setState({isLoading: false});
                if (response.status !== 200) {
                    this.setState({isLoading: false});
                    message.error(response.data.message)
                    return;
                }
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('widgets', null);
                this.props.setAdmin(false);
                this.props.history.push('/');
            }).catch(error => {
                this.setState({isLoading: false});
                message.error('An error occured, please retry');
            })
        }
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        if (this.state.loggedIn)
            return (
                <Redirect to="/" />
            )
        const responseFacebook = (responseData) => {
            this.setState({isLoading: true});
            axios.post("https://0.0.0.0:5000/loginWithFacebook", {
                email: responseData['email'],
                accessToken: responseData['accessToken'],
            }).then((response) => {
                this.setState({isLoading: false});
                if (response.status !== 200) {
                    this.setState({isLoading: false});
                    message.error(response.data.message)
                    return;
                }
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('widgets', null);
                this.props.setAdmin(response.data.admin);
                this.props.history.push('/');
            }).catch(error => {
                this.setState({isLoading: false});
                message.error("An error occured, please retry.")
            })
        }

        const responseGoogle = (responseData) => {

            if (responseData['error'] === 'undefined') {
                message.error(responseData['error'] );
                return;
            }
            console.log('google')
            console.log(responseData)
            this.setState({isLoading: true});
            axios.post("https://0.0.0.0:5000/loginWithGoogle", {
                email: responseData['profileObj']['email'],
                accessToken: responseData['accessToken'],
            }).then((response) => {
                this.setState({isLoading: false});
                if (response.status !== 200) {
                    this.setState({isLoading: false});
                    message.error(response.data.message)
                    return;
                }
                console.log(response.data)
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('widgets', null);
                this.props.setAdmin(response.data.admin);
                this.props.history.push('/');
            }).catch(error => {
                this.setState({isLoading: false});
                message.error("An error occured, please retry.")
            })
        }

        return (
            <section className="user">
                <div className="user_options-container">
                    <div className="user_options-text">
                        <div className="user_options-unregistered">
                            <h2 className="user_unregistered-title">Don't have an account?</h2>
                            <button className="user_unregistered-signup" id="signup-button" onClick={() => {
                                this.setState({
                                    sliderClass: 'bounceLeft'
                                })
                            }}>Sign up</button>
                        </div>
                        <div className="user_options-registered">
                            <h2 className="user_registered-title">Have an account?</h2>
                            <button className="user_registered-login" id="login-button" onClick={() => {
                                this.setState({
                                    sliderClass: 'bounceRight'
                                })
                            }}>Login</button>
                        </div>
                    </div>
                    <div className={"user_options-forms " + this.state.sliderClass} id="user_options-forms">
                        <div className="user_forms-login">
                            <Row>
                                <Col span={18}>
                                    <h2 className="forms_title">Login</h2>
                                </Col>
                                <Col span={6}>
                                    {this.state.isLoading ?
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                        : ''}
                                </Col>
                            </Row>
                            <Row gutter={16} style={{
                                marginBottom: '3vh'
                            }}>
                                <Col span={4}>
                                    <FacebookLogin
                                        appId="2810738258964599" //APP ID NOT CREATED YET
                                        fields="name,email"
                                        callback={responseFacebook}
                                        icon="fa-facebook"
                                        render={(renderProps) => <div style={{width: 50}}><ReactSVG className="loginNetworkButtons" onClick={renderProps.onClick} src="facebook.svg"/></div>}
                                    />
                                </Col>
                                <Col span={4}>
                                    <GoogleLogin
                                        clientId="401491189230-f5p17phmphk4upsol9tkrgdkga2vasd6.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                                        buttonText="LOGIN WITH GOOGLE"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        render={(renderProps) => <div style={{width: 50}}><ReactSVG className="loginNetworkButtons" onClick={renderProps.onClick} src="google.svg"/></div>}
                                    />
                                </Col>
                            </Row>
                            <form className="forms_form" onSubmit={this.handleSubmit}>
                                <fieldset className="forms_fieldset">
                                    <div className="forms_field">
                                        <input type="email" placeholder="Email" className="forms_field-input" name="loginEmail" required="" onChange={this.handleInputChange} autoFocus="" />
                                    </div>
                                    <div className="forms_field">
                                        <input type="password" placeholder="Password" className="forms_field-input" name="loginPassword" required="" onChange={this.handleInputChange} />
                                    </div>
                                </fieldset>
                                <div className="forms_buttons">
                                    <button type="button" className="forms_buttons-forgot">Forgot password?</button>
                                    <input type="submit" value="Log In" className="forms_buttons-action" />
                                </div>
                            </form>
                        </div>
                        <div className="user_forms-signup">
                            <Row>
                                <Col span={18}>
                                    <h2 className="forms_title">Sign Up</h2>
                                </Col>
                                <Col span={6}>
                                    {this.state.isLoading ?
                                        <div className="spinner">
                                            <div className="bounce1"></div>
                                            <div className="bounce2"></div>
                                            <div className="bounce3"></div>
                                        </div>
                                        : ''}
                                </Col>
                            </Row>
                            <form className="forms_form" onSubmit={this.handleSubmit}>
                                <fieldset className="forms_fieldset">
                                    <div className="forms_field">
                                        <input type="email" placeholder="Email" className="forms_field-input" name="registerEmail" required="" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="forms_field">
                                        <input type="password" placeholder="Password" className="forms_field-input" name="registerPassword" required="" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="forms_field">
                                        <input type="password" placeholder="Repeat Password" className="forms_field-input" name="registerRepeatedPassword" required="" onChange={this.handleInputChange} />
                                    </div>
                                </fieldset>
                                <div className="forms_buttons">
                                    <input type="submit" value="Sign up" className="forms_buttons-action" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connect((state) => {
    return {
        isAdmin: state.isAdmin,
    }
}, (dispatch) => {
    return {
        setAdmin: (isAdmin) => dispatch(adminAction(isAdmin))
    }
})(Login);
