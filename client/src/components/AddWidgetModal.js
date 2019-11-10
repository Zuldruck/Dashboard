import React, { Component } from 'react'
import ServiceCard from './ServiceCard'
import Axios from 'axios'
import { message, Modal } from 'antd'
import widgetConfig from './widgets/widgetConfig'

export class AddWidgetModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            disabledOk: true,
            subscribedServices: [],
            showWidgets: false,
            showServices: true,
            showSettings: false,
            widgetList: [],
            settingsValue: {},
            chosenWidget: {},
        }
    }

    updateSubscribedServices = () => {
        Axios.post('https://0.0.0.0:5000/getSubscribedServices', {
            access_token: localStorage.getItem('access_token'),
        }).then(response => {
            if (response.status !== 200) {
                message.error("An error occured, please retry.")
                return
            }
            let sub = []
            for (let x in response.data.services) {
                if (response.data.services[x])
                    sub.push(x)
            }
            this.setState({subscribedServices: sub})
        })
    }

    componentDidMount = () => {
        this.updateSubscribedServices()
    }

    handleOk = () => {
        const { chosenWidget } = this.state

        Axios.post("https://0.0.0.0:5000/addWidget", {
            access_token: localStorage.getItem('access_token'),
            widget: {
                name: chosenWidget.name,
                settings: this.state.settingsValue,
            }
        }).then(response => {
            if (response.status !== 200) {
                message.error("An error occured, please retry.")
                return
            }
            this.props.addWidget({
                name: chosenWidget.name,
                settings: this.state.settingsValue,
                id: response.data.id,
            })
            this.setState({
                disabledOk: true,
                showWidgets: false,
                showServices: true,
                showSettings: false,
                settingsComponent: <div></div>,
                widgetList: [],
                settingsValue: {},
            })
        })
        this.props.onOk();
    }

    handleCancel = () => {
        this.setState({
            disabledOk: true,
            showWidgets: false,
            showServices: true,
            showSettings: false,
            settingsComponent: <div></div>,
            widgetList: [],
            settingsValue: {},
        })
        this.props.onCancel();
    }

    onChooseService = (service) => {
        let widgetList = []

        widgetConfig.forEach((value, index) => {
            if (value.service === service)
                widgetList.push(value)
        })

        this.setState({
            showServices: false,
            showWidgets: true,
            widgetList,
        })
    }

    onChooseWidget = (widget) => {
        this.setState({
            showWidgets: false,
            showSettings: true,
            disabledOk: false,
            chosenWidget: widget,
        })
    }

    onValueChange = (value) => {
        console.log(value)
        this.setState({
            settingsValue: value,
        })
    }

    render() {
        return (
            <Modal
                title="Add a widget"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okButtonProps={{ disabled: this.state.disabledOk }}
                okText="Add"
            >
            {
                this.state.showServices && this.state.subscribedServices.map((value, index) => 
                    <ServiceCard 
                        key={index}
                        type={value}
                        onClick={() => this.onChooseService(value)}
                        style={{
                            marginTop: '4%',
                            marginBottom: '4%'
                        }}
                    />
                )
            }
            {
                this.state.showWidgets && this.state.widgetList.map((widget, index) => 
                    <ServiceCard 
                        key={index}
                        type={widget.service}
                        widgetTitle={widget.name}
                        onClick={() => this.onChooseWidget(widget)}
                        style={{
                            marginTop: '4%',
                            marginBottom: '4%'
                        }}
                    />
                )
            }
            {
                this.state.showSettings ? React.cloneElement(this.state.chosenWidget.settings, {onValueChange: this.onValueChange}) : ''
            }
            </Modal>
        )
    }
}

export default AddWidgetModal
