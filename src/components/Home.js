import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { message, Empty } from 'antd';
import { Dragact } from 'dragact';
import ReactSVG from 'react-svg';
import AddWidgetModal from './AddWidgetModal';
import widgetsConfig from './widgets/widgetConfig'
import Widget from './widgets/Widget';
import Axios from 'axios';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            widgets: [],
            width: 0,
            modalVisible: false,
        }
        const widgets = JSON.parse(localStorage.getItem("widgets"));
        if (localStorage.getItem("access_token") !== null)
            this.state.loggedIn = true
        if (widgets !== null)
            this.state.widgets = widgets;
        this.elem = React.createRef()
    }

    addWidget = (widget) => {
        let widgets = this.state.widgets.slice()
        const widgetConfig = widgetsConfig.find(value => value.name === widget.name)

        widgets.push({
            GridX: 0,
            GridY: 0,
            w: widgetConfig.widthGridSize,
            h: widgetConfig.heightGridSize,
            key: widgets.length.toString(),
            name: widgetConfig.name,
            component: widgetConfig.component,
            settingsComponent: widgetConfig.settings,
            settings: widget.settings,
            id: widget.id,
        })
        this.setState({widgets})
        localStorage.setItem("widgets", JSON.stringify(widgets))
    }

    onRemove = (widget) => {
        Axios.post("https://0.0.0.0:5000/removeWidget", {
            access_token: localStorage.getItem("access_token"),
            id: widget.id,
        }).then(response => {
            if (response.status !== 200) {
                message.error("An error occured, please retry.")
                return
            }
            const index = this.state.widgets.indexOf(widget)
            let newList = this.state.widgets.slice()

            newList.splice(index, 1)
            localStorage.setItem('widgets', JSON.stringify(newList))
            this.setState({
                widgets: newList
            })
        }).catch(error => {
            message.error("An error occured, please retry.")
        })
    }

    updateWidgets = () => {
        Axios.post("https://0.0.0.0:5000/getWidgets", {
            access_token: localStorage.getItem("access_token")
        }).then(response => {
            if (response.status !== 200) {
                message.error("An error occured, please retry.")
                return
            }
            for (let key in response.data.widgets) {
                if (key === "0")
                    continue
                this.addWidget(response.data.widgets[key])
            }
        }).catch(error => {
            message.error("An error occured, please retry.")
        })
    }
    
    componentDidMount = () => {
        if (!this.state.loggedIn)
            return;
        if (this.state.widgets.length === 0) {
            this.updateWidgets()
        } else {
            let idx = 0
            let { widgets } = this.state

            for (let x in this.state.widgets) {
                const widget = widgetsConfig.find(value => value.name === widgets[x].name)

                widgets[idx].component = widget.component
                widgets[idx].settingsComponent = widget.settings
                idx += 1
            }
            this.setState({widgets})
        }
        setTimeout(() => {
            if (!this.elem || !this.elem.current)
                return
            this.setState({
                width: this.elem.current.offsetWidth,
            })
        }, 100)
        window.addEventListener('resize', () => {
            if (!this.elem || !this.elem.current)
                return
            setTimeout(() => {
                this.setState({
                    width: this.elem.current.offsetWidth,
                })
            }, 100)
        })
    }

    onDragEnd = (event) => {
        let widgets = this.state.widgets;

        widgets[parseInt(event.UniqueKey)].GridX = event.GridX;
        widgets[parseInt(event.UniqueKey)].GridY = event.GridY;
        localStorage.setItem("widgets", JSON.stringify(widgets));
    }

    onCancel = () => {
        this.setState({modalVisible: false})
    }

    onOk = () => {
        this.setState({modalVisible: false})
    }

    onUpdateItem = (item, settings) => {
        let { widgets } = this.state
        const index = widgets.indexOf(item)

        widgets[index].settings = settings
        this.setState({widgets})
        localStorage.setItem('widgets', JSON.stringify(widgets))
    }

    render() {
        if (!this.state.loggedIn)
            return (
                <Redirect to="/login"/>
            )
        return (
            <div
                ref={this.elem}
            >
                { this.state.widgets.length !== 0 ?
                <Dragact
                    layout={this.state.widgets}
                    col={16}
                    width={this.state.width}
                    rowHeight={60}
                    margin={[10, 10]}
                    placeholder={true}
                    onDragEnd={this.onDragEnd}
                >
                    {(item, provided) => {
                        return (
                            <div
                                {...provided.props}
                                {...provided.dragHandle}
                                style={{...provided.props.style}}
                            >
                                <Widget
                                    type={item.name}
                                    id={item.id}
                                    height={provided.props.style.height}
                                    settings={item.settings}
                                    settingsComponent={item.settingsComponent}
                                    onRemove={() => {this.onRemove(item)}}
                                    onUpdate={(settings) => this.onUpdateItem(item, settings)}
                                >
                                    {item.component}
                                </Widget>
                            </div>
                        )
                    }}
                </Dragact>
                :
                <Empty style={{marginTop: '3%'}}/>
                }
                <div className="addWidgetButton" onClick={() => this.setState({modalVisible: true})}>
                    <ReactSVG src="plus.svg" style={{
                        marginTop: '15px',
                        marginLeft: '15px',
                    }} />
                </div>
                <AddWidgetModal
                    visible={this.state.modalVisible}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    addWidget={this.addWidget}
                />
            </div>
        )
    }
}

export default withRouter(Home);
