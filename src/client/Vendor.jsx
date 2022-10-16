import React, { Component } from 'react';
import Chance from 'chance';

import cssColorNames from './lib/css-color-names';

const chance = new Chance;

const randomColor = () => { 
    const idx = Math.floor((Math.random() * 148));
    return cssColorNames[idx];
}

const randomProductDescription = () =>  { 
    return `Plush ${randomColor()} ${chance.animal()} x${Math.floor(Math.random() * 10 + 1)}`;
}

class PickupRequest extends Component {
    render() { 
        const status = this.props.deliveryStatus;
        if(status === "requested"){
            return (<div className='vendor-pickup-request'>
                📦 Request sent for pickup of: {this.props.pickupRequest.contents}
            </div>);
        } else if(status === "picked-up") {
            return (<div className='vendor-pickup-request'>
                🚚 In transit: {this.props.pickupRequest.contents}
            </div>);
        } else if(status === "delivered") {
            return (<div className='vendor-pickup-request'>
                ✅ Delivered: {this.props.pickupRequest.contents}
            </div>);
        } else {
            return (<div className='vendor-pickup-request'>
                Unknown status: {status} {this.props.pickupRequest.contents}
            </div>);
        }
    }
}
 

class PickupRequests extends Component {
    render(){
        return (
            <div className="vendor-pickup-requests">
                {this.props.pickupRequests.map((pickupRequest) => {
                    const deliveryStatus = this.props.deliveryStatus[pickupRequest.id];
                    return (<PickupRequest key={pickupRequest.id} {...{pickupRequest, deliveryStatus}}/>)
                })}
            </div>

        )
    }
}


class Vendor extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onPickupWasAccepted = this.onPickupWasAccepted.bind(this);
        this.onItemWasDelivered = this.onItemWasDelivered.bind(this);
        this.props.vendor.relay.setOnPickupWasAcceptedCallback(this.onPickupWasAccepted);
        this.props.vendor.relay.setOnItemWasDeliveredCallback(this.onItemWasDelivered);
        this.state = {pickupRequests: [], deliveryStatus: {}};

    }

    onPickupWasAccepted(payload){
        const item = payload.item;
        const deliveryStatus = this.state.deliveryStatus;
        deliveryStatus[item.id] = "picked-up";
        this.setState({...this.state, deliveryStatus});
    }

    onItemWasDelivered(payload){
        const item = payload.item;
        const deliveryStatus = this.state.deliveryStatus;
        deliveryStatus[item.id] = "delivered";
        this.setState({...this.state, deliveryStatus});
    }

    onClick() { 
        const contents = randomProductDescription();
        const item = { contents, vendor: this.props.vendor, id: chance.guid()};
        console.log("Vendor requesting pickup", item)
        this.props.vendor.relay.requestPickup(item, this.props.vendor.toJSON())
        const pickupRequests = this.state.pickupRequests;
        pickupRequests.push(item);
        const deliveryStatus = this.state.deliveryStatus;
        deliveryStatus[item.id] = "requested";
        this.setState({...this.state, pickupRequests, deliveryStatus});
    }
    render() { 
        return (<li className="vendor-container">
            <div>
                <p> Vendor </p>
                <p> {this.props.vendor.name} </p>
                <p> <button onClick={this.onClick}> Request Pickup </button> </p>
                <PickupRequests pickupRequests={this.state.pickupRequests} deliveryStatus={this.state.deliveryStatus}/>
            </div>
        </li> );
    }
}
 
export default Vendor;