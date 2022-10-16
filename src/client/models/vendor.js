import { VendorConnection } from "../lib/socket-connection";
import Chance from 'chance';
const chance = new Chance();

function createVendor() { 
    const vendor = {
        name: chance.name(),
        id: chance.guid(),
        relay: new VendorConnection(),
        toJSON: function () { 
            return {
                name: this.name,
                id: this.id
            };
        }
    }
    return vendor;
}

export default createVendor;