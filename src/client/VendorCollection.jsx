import React, { Component } from 'react';
import Chance from 'chance';
import Vendor from "./Vendor";

const chance = new Chance();

function createVendor() { 
    return {
        name: chance.name(),
        id: chance.guid()
    }
}

class VendorCollection extends Component {
    constructor(props) {
        super(props);
        this.state = { vendors: [{ name: "Kate" }, { name: "Sally" }] };
        this.addVendor = this.addVendor.bind(this);
    }
    addVendor() {
        const d = createVendor();
        const vendors = this.state.vendors;
        vendors.push(d);
        this.setState({...this.state, vendors})
    }
    render() { 
        return (
            <ul>
                <li> Vendors: <button onClick={this.addVendor}> Add Vendor </button>
                <ul>
                    {(this.state.vendors.map((d) => <Vendor key={d.name} name={d.name}></Vendor>))}
                </ul>
                </li>
            </ul>
        );
    }
}
 
export default VendorCollection;