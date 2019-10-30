import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'

const { Sider } = Layout;

export class Sidebar extends Component {
    
    render() {
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div className="logo">
                    {this.props.collapsed ? "E" : "EpiBoard"}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/">
                            <Icon type="dashboard" />
                            <span>Dashboard</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/services">
                            <Icon type="setting" />
                            <span>Services</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/widgets">
                            <Icon type="build" />
                            <span>Widgets</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export default Sidebar;