import React, { Component } from 'react';

class DriverItem extends Component {
    render() {
        const { acceptPickup, rejectPickup, deliveryRequest } = this.props;
        return (
            <div className="driver-item">
                <p> item: {deliveryRequest.item.contents} </p>
                <p> <button onClick={() => acceptPickup(deliveryRequest)} disabled={this.props.driverBusy}>Accept</button>
                    <button onClick={() => rejectPickup(deliveryRequest)}>Reject</button></p>
            </div>
        )
    }
}

const deleteItemFromDeliveryRequestsyById = (arr) => (id) => {
    return arr.filter((item) => item.item.id !== id)
}

class Driver extends Component {

    constructor(props) {
        super(props);
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.onPickupAccepted = this.onPickupAccepted.bind(this);
        this.acceptPickup = this.acceptPickup.bind(this);
        this.rejectPickup = this.rejectPickup.bind(this);
        this.state = { deliveryRequests: [], busy: false, currentDelivery: null };
    }

    componentDidMount() {
        const relay = this.props.driver.relay;
        relay.setOnRequestPickupCallback(this.onRequestPickup);
        relay.setOnPickupWasAcceptedCallback(this.onPickupAccepted)
    }

    onRequestPickup(payload) {
        console.log("Driver: onRequestPickup", this.props.driver.name, payload);
        this.addDeliveryRequest(payload);
    }

    onPickupAccepted(payload) {
        if(payload.driver.id === this.props.driver.id){
            console.log(`Driver ${this.props.driver.name}'s pickup was accepted`)
            const deliveryRequests = deleteItemFromDeliveryRequestsyById(this.state.deliveryRequests)(payload.item.id);
            this.setState({...this.state, busy: true, currentDelivery: payload, deliveryRequests});
            setTimeout(()=>{
                this.delivered(payload);
            }, Math.floor(Math.random()*5000+3000));
        } else {
            this.removeDeliveryRequest(payload);
        }
    }

    delivered(payload) {
        console.log(`Driver delivered ${payload.item.contents}`)
        this.props.driver.relay.deliveryComplete(payload);
        this.setState({...this.state, busy: false, currentDelivery: null})
    }

    addDeliveryRequest(payload) {
        const deliveryRequests = this.state.deliveryRequests;
        deliveryRequests.push(payload);
        this.setState({ ...this.state, deliveryRequests });
    }

    removeDeliveryRequest(payload) { 
        const deliveryRequests = deleteItemFromDeliveryRequestsyById(this.state.deliveryRequests)(payload.item.id);
        this.setState({...this.state, deliveryRequests})
    }

    acceptPickup(payload) { 
        const relay = this.props.driver.relay;
        relay.acceptPickup(payload);
    }

    rejectPickup(payload) { 
        const relay = this.props.driver.relay;
        relay.rejectPickup(payload);
        this.removeDeliveryRequest(payload);
    }

    render() { 
        const driverId = this.props.driver.id;
        console.log(this.state)
        return (<li>
            <div className="driver-container">
                <p>Driver</p>
                <p> {this.props.driver.name}</p>
                {this.state.currentDelivery ? (
                    <div className='driver-current-delivery'>
                        Current Delivery: <div className="driver-busy-truck"></div> {this.state.currentDelivery.item.contents} for {this.state.currentDelivery.item.vendor.name}
                    
                    </div>
                )
                : ""}
                {this.state.deliveryRequests.map(dr => { 
                    return (<DriverItem key={dr.item.id + driverId}
                        deliveryRequest={dr}
                        acceptPickup={this.acceptPickup}
                        rejectPickup={this.rejectPickup}
                        driverBusy={this.state.busy}
                    />)
                })}
            </div>
        </li>);
    }
}
 
export default Driver;