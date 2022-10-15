import React, { Component } from 'react';
import Chance from 'chance';
import Driver from "./Driver";

const chance = new Chance();

function createDriver() { 
    return {
        name: chance.name(),
        id: chance.guid()
    }
}

class DriverCollection extends Component {
    constructor(props) {
        super(props);
        this.state = { drivers: [{ name: "John" }, { name: "Jane" }] };
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
                    {(this.state.drivers.map((d) => <Driver key={d.name} name={d.name}></Driver>))}
                </ul>
                </li>
            </ul>
        );
    }
}
 
export default DriverCollection;