import React, { Component } from 'react'
import { Card } from 'antd'
import widgetConfig from './widgetConfig'

export class Widget extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: 'white',
            type: props.type,
            component: <div />,
        }
    }

    componentDidMount = () => {
        const widget = widgetConfig.find(value => value.name === this.state.type)
        
        if (this.state.type === value)
            this.setState({
                color: widget.color,
                component: widget.component
            })
    }

    render() {
        return (
            <Card
                hoverable
                style={{
                    borderRadius: '10px',
                    height: this.props.height,
                    backgroundColor: this.state.color,
                }}
            >
                {this.state.component}
            </Card>
        )
    }
}

export default Widget
