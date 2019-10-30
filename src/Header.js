import React, { Component } from 'react';
import { Layout, Icon } from 'antd';

export class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            toggle: props.toggle,
        }
    }

    render() {
        return (
            <div>
                <Layout.Header style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={() => {
                            this.setState({
                                collapsed: !this.state.collapsed,
                            });
                            this.state.toggle();
                        }}
                    />
                </Layout.Header>
            </div>
        )
    }
}

export default Header;
