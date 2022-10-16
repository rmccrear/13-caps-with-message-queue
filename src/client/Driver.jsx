import React, { Component } from 'react';

class Driver extends Component {
    constructor(props) {
        super(props);
        this.onRequestPickup = this.onRequestPickup.bind(this);
    }
    componentDidMount() {
        const relay = this.props.driver.relay;
        relay.setOnRequestPickupCallback(this.onRequestPickup);
    }
    state = { deliveryRequests: [] }
    onRequestPickup(payload) {
        console.log("Driver: onRequestPickup", this.props.driver.name, payload);
        this.addDeliveryRequest(payload);
    }
    addDeliveryRequest(payload) {
        const deliveryRequests = this.state.deliveryRequests;
        deliveryRequests.push(payload);
        this.setState({ ...this.state, deliveryRequests });
    }
    render() { 
        const driverId = this.props.driver.id;
        return (<li>
            <div className="driver-container">
                <p> Driver </p>
                <p> {this.props.driver.name}</p>
                {this.state.deliveryRequests.map(dr => { 
                    return (<p key={dr.item.id + driverId}> item: { dr.item.contents } </p>)
                })}
            </div>
        </li>);
    }
}
 
export default Driver;