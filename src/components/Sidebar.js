import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

const { Sider } = Layout;

class Sidebar extends Component {
    
    render() {
        const defaultSelectedKey = () => {
            if (this.props.location.pathname === '/')
                return '1';
            else if (this.props.location.pathname === '/services')
                return '2';
            else if (this.props.location.pathname === '/users' && this.props.isAdmin)
                return '3';
            return '1';
        }
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo">
                    {this.props.collapsed ? "E" : "EpiBoard"}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultSelectedKey()]}>
                    <Menu.Item key="1" style={{
                        fontSize: 18
                    }}>
                        <Link to="/">
                            <Icon type="dashboard" />
                            <span>Dashboard</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" style={{
                        fontSize: 18
                    }}>
                        <Link to="/services">
                            <Icon type="setting" />
                            <span>Services</span>
                        </Link>
                    </Menu.Item>
                    {this.props.isAdmin ?
                        <Menu.Item key="3" style={{
                            fontSize: 18
                        }}>
                            <Link to="/users">
                                <Icon type="user" />
                                <span>Users</span>
                            </Link>
                        </Menu.Item>
                    : ''}
                </Menu>
            </Sider>
        )
    }
}

export default connect((state) => {
    return {
        isAdmin: state.isAdmin
    }
}, {})(withRouter(Sidebar));