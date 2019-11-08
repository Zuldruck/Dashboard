import React, { Component } from 'react'
import { Card, Popconfirm, Modal, message } from 'antd'
import widgetConfig from './widgetConfig'
import ReactSVG from 'react-svg';
import ComponentWrapper from './ComponentWrapper';
import Axios from 'axios';

export class Widget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: 'lightgrey',
            type: props.type,
            id: props.id,
            settingsVisible: false,
            settings: props.settings,
            saveSettings: {},
        }
    }

    componentDidMount = () => {
        const widget = widgetConfig.find(value => value.name === this.state.type)
        
        this.setState({
            color: widget.color,
            component: widget.component
        })
        setInterval(() => this.setState({
            settings: this.state.settings
        }), this.state.settings.timer * 1000 * 60)
    }

    handleOk = () => {
        const { saveSettings } = this.state

        this.setState({
            settingsVisible: false,
            settings: saveSettings,
            saveSettings: {},
        })
        this.setState({
            settingsVisible: false,
            settings: saveSettings,
            saveSettings: {},
        })
        Axios.post("https://0.0.0.0:5000/updateWidget", {
            access_token: localStorage.getItem('access_token'),
            id: this.state.id,
            settings: saveSettings,
        }).catch(error => {
            message.error('An error occured, please retry.')
        })
        this.props.onUpdate(saveSettings)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return nextProps.settings !== this.props.settings
        || nextProps.type !== this.props.type
        || this.state !== nextState
    } 

    render() {
        return (
            <Card
                id="scrollbar"
                hoverable
                style={{
                    borderRadius: '10px',
                    height: this.props.height,
                    backgroundColor: this.state.color,
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    position: 'relative',
                }}
            >
                <ComponentWrapper 
                    type={this.state.type}
                    style={{
                        fontWeight: 'bold',
                        color: 'white'
                    }}
                    settings={this.state.settings}
                />
                <div className="widgetSettings" onClick={() => this.setState({
                    settingsVisible: true
                })}>
                    <ReactSVG src="settings.svg"/>
                </div>
                <Popconfirm
                    title="Are you sure you want to delete this widget ?"
                    onConfirm={this.props.onRemove}
                    okText="Yes"
                    cancelText="No"
                >
                    <div className="widgetRemove">
                        <ReactSVG src="remove.svg"/>
                    </div>
                </Popconfirm>
                <Modal
                    title="Configure widget"
                    visible={this.state.settingsVisible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({settingsVisible: false, saveSettings: {}, settings: this.state.settings})}
                    okText="Modify"
                >
                    {React.cloneElement(this.props.settingsComponent, {onValueChange: (obj) => {this.setState({saveSettings: obj})}, ...this.state.settings})}
                </Modal>
            </Card>
        )
    }
}

export default Widget
