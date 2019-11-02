import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from "axios";
import { List, Avatar, Tag, Button, message } from "antd";

export class Users extends Component {
    
    constructor(props) {
        super (props);
        this.state = {
            loggedIn: false,
            isAdmin: this.props.isAdmin,
            users: [],
            access_token: '',
        }
        const access_token = localStorage.getItem("access_token")
        if (access_token !== null) {
            this.state.loggedIn = true;
            this.state.access_token = access_token;
        }
    }

    updateUsers = () => {
        axios.post("https://0.0.0.0:5000/getUsers", {
            "access_token": this.state.access_token
        }).then(response => {
            if (response.status !== 200)
                return;
            const users = response.data.users;
            let newStateUser = [];
            
            for (let key in users)
                newStateUser.push(users[key]);
            this.setState({
                users: newStateUser
            })
        }).catch(error => {
            message.error('Something went wrong, please retry.');
        });
    }

    componentDidMount = () => {
        if (!this.state.loggedIn)
            return;
        this.updateUsers();
    }

    handleSetAdmin = (email) => {
        axios.post("https://0.0.0.0:5000/modifyPermission", {
            login: email,
            access_token: this.state.access_token,
            admin: 1,
        }).then(response => {
            this.updateUsers();
        }).catch(error => {
            message.error('Something went wrong, please retry.');
        });
    }

    handleDelete = (email) => {
        axios.post("https://0.0.0.0:5000/delete", {
            login: email,
            access_token: this.state.access_token,
        }).then(response => {
            this.updateUsers();
        }).catch(error => {
            message.error('Something went wrong, please retry.');
        });
    }

    render() {
        if (!this.state.loggedIn)
            return (<Redirect to="/login" />)
        else if (!this.state.isAdmin)
            return (<Redirect to="/" />)
        console.log(this.state.users)
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.users}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={
                                <div>
                                    <span>{item.email}</span>
                                    {item.admin === 1 ? <Tag color="red" style={{marginLeft: '1%'}}>Admin</Tag> : ''}
                                </div>
                            }
                        />
                        {item.admin === 0 ? <Button type="default" style={{marginRight:'1%'}} onClick={() => this.handleSetAdmin(item.email)}>Set Admin</Button> : ''}
                        {item.admin === 0 ? <Button type="danger" onClick={() => this.handleDelete(item.email)}>Delete</Button> : ''}
                    </List.Item>
                )}
            />
        )
    }
}

export default connect((state) => {
    return {
        isAdmin: state.isAdmin
    }
}, {})(Users);