import { io } from "socket.io-client"

class SocketConnection { 
    constructor() {
        this.socket = io();
    }
    emit(event, payload) { 
        console.log("SocketConnection sending", event, payload)
        this.socket.emit(event, payload)
    }
}

class VendorConnection extends SocketConnection { 
    constructor(id, name) {
        super();
        this.emit("join-as-vendor", {id, name});
    }
    requestPickup(item, vendor) { 
        console.log("VendorConnection sending request-pickup event to server")
        this.emit("request-pickup", { item, vendor });
    }
}


class DriverConnection extends SocketConnection { 
    constructor(id, name) {
        super();
        this.emit("join-as-driver", {id, name});
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.onRequestPickup();
    }
    onRequestPickup() { 
        this.socket.on("request-pickup-to-driver", (payload) => {
            console.log("DriverConnection receiving request-pickup-for-driver")
            if (this.onRequestPickupCallback) { 
                this.onRequestPickupCallback(payload);
            }
         } )
    }
    setOnRequestPickupCallback(fn) { 
        this.onRequestPickupCallback = fn;
    }
}

export { SocketConnection, VendorConnection, DriverConnection };