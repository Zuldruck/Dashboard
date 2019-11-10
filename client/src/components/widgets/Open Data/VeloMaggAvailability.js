import React, { Component } from 'react';
import axios from 'axios';

export class VeloMaggAvailability extends Component {

    constructor(props) {
        super(props);
        this.state = {
            park: props.park,
            slots: 0,
        }
    }

    updateList = (nextPark) => {
        axios.post("https://0.0.0.0:5000/services/openDataMontpellier/veloMaggParks", {
            park: nextPark || this.state.park,
            access_token: localStorage.getItem("access_token"),
        }).then(response => {
            if (response.status !== 200)
                return;
            this.setState({slots: parseInt(response.data.availablePlaces)})
        });
    }

    componentDidMount = () => {
        this.updateList()
    }

    componentWillUpdate = (nextProps) => {
        if (nextProps !== this.props) {
            this.updateList(nextProps.park)
        }
    }

    render() {
        return (
            <div>
                <h2 className="widgetTitle">
                    {"Available VeloMagg Slots in " + this.props.park}
                </h2>
                <p style={{
                    ...this.props.style,
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 42,
                    marginBottom: 0,
                }}>
                    {this.state.slots}
                </p>
            </div>
        )
    }
}

export default VeloMaggAvailability;
