import React, { Component } from 'react';


class Vendor extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return (<li className="vendor-container">
            <div>
                <p> Vendor </p>
                <p> {this.props.name} </p>
            </div>
        </li> );
    }
}
 
export default Vendor;