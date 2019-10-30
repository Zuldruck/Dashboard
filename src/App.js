import React, { Component } from 'react'
import './App.css';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { Layout } from 'antd';

const { Content } = Layout;

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            collapsed: false,
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <Layout>
                <Sidebar
                    collapsed={this.state.collapsed}
                />
                <Layout
                    style={{
                        height: "100vh"
                    }}
                >
                    <Header 
                        toggle={this.toggle}
                    />
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        Content
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

