import React, { Component } from 'react'
import './App.css';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { Layout } from 'antd';

const { Content } = Layout;


export class App extends Component {

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
            <div>
                <Layout>
                    <Sidebar
                        collapsed={this.state.collapsed}
                    />
                    <Layout>
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
            </div>
        );
    }
}

export default App;
