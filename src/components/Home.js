import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from 'antd';
import { Dragact } from 'dragact';

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
            this.setState({
                width: this.elem.current.offsetWidth
            })
        }, 100);
    }

    onDragEnd = (event) => {
        let widgets = this.state.widgets;

        widgets[parseInt(event.UniqueKey)].GridX = event.GridX;
        widgets[parseInt(event.UniqueKey)].GridY = event.GridY;
        localStorage.setItem("widgets", JSON.stringify(widgets));
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
                                    type="inner"
                                    title={item.title}
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
            </div>
        )
    }
}

export default Home;
