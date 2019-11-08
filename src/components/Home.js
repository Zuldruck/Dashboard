import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Card } from 'antd';
import { Dragact } from 'dragact';
import ReactSVG from 'react-svg';
import AddWidgetModal from './AddWidgetModal';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            widgets: [
                { GridX: 0, GridY: 0, w: 4, h: 4, key: '0', title: 'Football Live Matches', content: 'Matches' },
                { GridX: 0, GridY: 0, w: 4, h: 4, key: '1', title: 'Football Ranks', content: 'Ranks' },
                { GridX: 0, GridY: 0, w: 4, h: 4, key: '2', title: 'Cocktails List', content: 'List' },
            ],
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
    
    getblockStyle = (isDragging) => {
        return {
            background: isDragging ? 'lightgrey' : 'white',
        }
    };
    
    componentDidMount = () => {
        if (!this.state.loggedIn)
            return;
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

    addWidget = (widgetName) => {

    }

    onCancel = () => {
        this.setState({modalVisible: false})
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
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: '10px',
                                        height: provided.props.style.height,
                                        ...this.getblockStyle(provided.isDragging)
                                    }}
                                >
                                    <p>{item.content}</p>
                                </Card>
                            </div>
                        )
                    }}
                </Dragact>
                <div className="addWidgetButton" onClick={() => this.setState({modalVisible: true})}>
                    <ReactSVG src="plus.svg" style={{
                        marginTop: '15px',
                        marginLeft: '15px',
                    }} />
                </div>
                <AddWidgetModal visible={this.state.modalVisible} onCancel={this.onCancel} onOk={this.onOk}/>
            </div>
        )
    }
}

export default withRouter(Home);
