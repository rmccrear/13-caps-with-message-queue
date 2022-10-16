
import { DriverConnection } from "../lib/socket-connection";
import Chance from 'chance';
const chance = new Chance();

function createDriver() { 
    const name = chance.name();
    const id = chance.guid();
    const relay = new DriverConnection(id, name);
    const driver = {
        name,
        id,
        relay,
        toJSON: function () { 
            return {
                name: this.name,
                id: this.id
            };
        }
    }
    return driver;
}

export default createDriver;