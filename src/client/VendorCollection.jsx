import React, { Component } from 'react';
import Vendor from "./Vendor";

import { createVendor } from "./models";


class VendorCollection extends Component {
    constructor(props) {
        super(props);
        this.state = { vendors: [createVendor(), createVendor()] };
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
                        {(this.state.vendors.map((v) => <Vendor key={v.name} vendor={v}></Vendor>))}
                </ul>
                </li>
            </ul>
        );
    }
}
 
export default VendorCollection;