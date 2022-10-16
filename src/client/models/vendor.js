import { VendorConnection } from "../lib/socket-connection";
import Chance from 'chance';
const chance = new Chance();

function createVendor() { 
    const name = chance.name();
    const id = chance.guid();
    const vendor = {
        name,
        id,
        relay: new VendorConnection(id, name),
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