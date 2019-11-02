import React, { Component } from 'react';
import { Layout, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminAction } from '../actions'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            toggle: props.toggle,
        }
    }

    handleLogout = () => {
        localStorage.clear();
        this.props.history.push('/login');
        this.props.setAdmin(false);
    }

    render() {
        return (
            <Layout.Header style={{ background: '#fff', padding: 0, width: '100%' }}>
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
                <Icon
                    className="trigger"
                    style={{
                        float: 'right',
                        lineHeight: '64px',
                    }}
                    type="logout"
                    onClick={this.handleLogout}
                />
            </Layout.Header>
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
})(withRouter(Header));
