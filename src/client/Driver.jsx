import React, { Component } from 'react';

class Driver extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return (<li>
            <div className="driver-container">
                <p> Driver </p>
                <p>{this.props.name}</p>
            </div>
        </li>);
    }
}
 
export default Driver;