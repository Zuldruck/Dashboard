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

    shadeColor = (color, percent) => {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }
    

    componentDidMount = () => {
        const widget = widgetConfig.find(value => value.name === this.state.type)
        
        this.setState({
            color: this.shadeColor(widget.color, 10),
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
                    overflowY: 'auto',
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
