import React, { Component } from 'react';
import Driver from "./Driver";
import { createDriver } from './models';


class DriverCollection extends Component {
    constructor(props) {
        super(props);
        this.state = { drivers: [createDriver(), createDriver()] };
        this.addDriver = this.addDriver.bind(this);
    }
    addDriver() {
        const d = createDriver();
        const drivers = this.state.drivers;
        drivers.push(d);
        this.setState({...this.state, drivers})
    }
    render() { 
        return (
            <ul>
                <li> Drivers: <button onClick={this.addDriver}> Add Driver </button>
                <ul>
                    {(this.state.drivers.map((d) => <Driver key={d.id} driver={d}></Driver>))}
                </ul>
                </li>
            </ul>
        );
    }
}
 
export default DriverCollection;