import { io } from "socket.io-client"

const socket = io();

class SocketConnection { 
    emit(event, payload) { 
        console.log("SocketConnection sending", event, payload)
        socket.emit(event, payload)
    }
}

class VendorConnection extends SocketConnection { 
    constructor() {
        super();
    }
    requestPickup(item, vendor) { 
        console.log("VendorConnection sending request-pickup event to server")
        this.emit("request-pickup", { item, vendor });
    }
}

export { SocketConnection, VendorConnection };