import React, { Component } from 'react';
import Chance from 'chance';

import cssColorNames from './lib/css-color-names';

const chance = new Chance;

const randomColor = () => { 
    const idx = Math.floor((Math.random() * 148));
    return cssColorNames[idx];
}

const randomProductDescription = () =>  { 
    return `Stuffed ${randomColor()} ${chance.animal()} x${Math.floor(Math.random() * 10 + 1)}`;
}


class Vendor extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    state = {  }
    onClick() { 
        const contents = randomProductDescription();
        const item = { contents, vendor: this.props.vendor};
        console.log("Vendor requesting pickup", item)
        this.props.vendor.relay.requestPickup(item, this.props.vendor.toJSON())
    }
    render() { 
        return (<li className="vendor-container">
            <div>
                <p> Vendor </p>
                <p> {this.props.vendor.name} </p>
                <p> <button onClick={this.onClick}> Request Pickup </button> </p>
            </div>
        </li> );
    }
}
 
export default Vendor;