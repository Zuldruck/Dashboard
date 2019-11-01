import React, { Component } from 'react';
import './login.css';
import axios from 'axios';
import { message } from 'antd';

export class Login extends Component {
    
    constructor() {
        super();
        this.state = {
            loginEmail: '',
            loginPassword: '',
            registerEmail: '',
            registerPassword: '',
            registerRepeatedPassword: '',
            sliderClass: '',
        }
    }
    
    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.sliderClass === ''
        || this.state.sliderClass === 'bounceRight') {
            axios.post("https://0.0.0.0:5000/login", {
                login: this.state.loginEmail,
                password: this.state.loginPassword,
            }).then((response) => {
                if (response.data.success !== 200) {
                    message.error(response.data.message)
                    return;
                }
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('email', this.state.loginEmail);
                window.location.replace('http://localhost:3000/')
            })
        } else {
            if (this.state.registerPassword !== this.state.registerRepeatedPassword) {
                message.warning('Passwords do not match', 3);
                return;
            }
            axios.post("https://0.0.0.0:5000/register", {
                login: this.state.registerEmail,
                password: this.state.registerPassword,
                admin: 0,
            }).then((response) => {
                if (response.data.success !== 200) {
                    message.error(response.data.message)
                    return;
                }
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('email', this.state.registerEmail);
                window.location.replace('http://localhost:3000/')
            })
        }
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div>
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
                                <h2 className="forms_title">Login</h2>
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
                                <h2 className="forms_title">Sign Up</h2>
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
            </div>
        )
    }
}

export default Login;
