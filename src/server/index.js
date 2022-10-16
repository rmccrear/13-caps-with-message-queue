const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("static"))

const dateFormatter = require("date-format");
class Logger { 
    constructor(server){
        this.server = server;
    }
    log(event, payload) { 
        let eventText;
        switch (event) {
            case "request-pickup":
                eventText = `${payload.vendor.name} is requesting pickup for ${payload.item.contents}.`
                break;
            case "request-pickup-to-driver":
                eventText = `${payload.vendor.name} is sending a pickup request to drivers`
                break;
            case "driver-accept-pickup":
                eventText = `Driver ${payload.driver.name} has accepted ${payload.item.contents} from ${payload.item.vendor.name} (itemId: ${payload.item.id})`
                break;
            case "pickup-accepted":
                eventText = `Notify clients: ${payload.driver.name} has accepted ${payload.item.contents} from ${payload.item.vendor.name} (itemId: ${payload.item.id})`
                break;
            case "delivery-complete":
                eventText = `Driver ${payload.driver.name} has completed delivery of ${payload.item.contents}`;
                break;
            case "delivered":
                eventText = `Notifying ${payload.item.vendor.name} of completed delivery`;
                break;
        }
        const logLine = `EVENT: ${dateFormatter()} (${event}) ${eventText}`;
        console.log(logLine);
        // console.log("EVENT:", dateFormatter(), `(${event})`, eventText)
        this.server.in("loggers").emit("log", logLine)
    }
}

class Hub {
    constructor(io) { 
        this.logger = new Logger(io);
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.onAcceptPickup = this.onAcceptPickup.bind(this);
        this.onDeliveryComplete = this.onDeliveryComplete.bind(this);
        this.io = io;
    }
    // Send to driver
    sendRequestPickup(payload) { 
        const event = "request-pickup-to-driver";
        this.logger.log(event, payload);
        const clients = io.sockets.adapter.rooms.get('drivers');
        this.io.in("drivers").emit(event, payload);
    }
    onRequestPickup(payload) { 
        const event = "request-pickup";
        this.logger.log(event, payload);
        this.sendRequestPickup(payload); // send to driver
    }
    sendAcceptPickup(payload) {
        // send to client(s)
        // TODO: only send to client who requested delivery
        this.io.in("vendors").emit("pickup-accepted", payload);
        // send to drivers to clear request list
        this.io.in("drivers").emit("pickup-accepted", payload)

     }
    onAcceptPickup(payload) {
        const event = "pickup-accepted";
        this.logger.log(event, payload);
        this.sendAcceptPickup(payload);

     }
     onDeliveryComplete(payload){
        const event = "delivered";
        this.logger.log(event, payload);
        this.sendDelivered(payload);
     }
     sendDelivered(payload){
        // TODO: send the the vendor who sent it.
        this.io.in("vendors").emit("delivered", payload);
     }
 }

const hub = new Hub(io);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('request-pickup', hub.onRequestPickup);
    socket.on('driver-accept-pickup', hub.onAcceptPickup)
    socket.on("delivery-complete", hub.onDeliveryComplete)

    socket.on('join-as-vendor', (payload) => { 
        console.log("joining as vendor", payload);
        socket.join("vendors");
        const clients = io.sockets.adapter.rooms.get('vendors');
        console.log("in room drivers", clients)
    })
    
    socket.on('join-as-driver', (payload) => { 
        console.log("joining as driver", payload);
        socket.join("drivers");
        const clients = io.sockets.adapter.rooms.get('drivers');
        console.log("in room drivers", clients)
    })

    socket.on('join-as-logger', (payload) => { 
        console.log("joining as logger", payload);
        socket.join("loggers");
        const clients = io.sockets.adapter.rooms.get('loggers');
        console.log("in room loggers", clients)
    })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});