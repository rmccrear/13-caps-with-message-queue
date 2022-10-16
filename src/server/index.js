const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("static"))

const dateFormatter = require("date-format");
class Logger { 
    log(event, payload) { 
        let eventText;
        switch (event) {
            case "request-pickup":
                eventText = `${payload.vendor.name} is requesting pickup for ${payload.item.contents}.`
                break;
            case "request-pickup-to-driver":
                eventText = `sending request ${payload.vendor.name}`
                break;
            case "driver-accept-pickup":
                eventText = `Driver ${payload.driver.name} has accepted ${payload.item.contents} from ${payload.item.vendor.name} (itemId: ${payload.item.id})`
                break;
            case "pickup-accepted":
                console.log(payload);
                eventText = `Notify clients: ${payload.driver.name} has accepted ${payload.item.contents} from ${payload.item.vendor.name} (itemId: ${payload.item.id})`
                break;
         }
         console.log("EVENT:", dateFormatter(), `(${event})`, eventText)
    }
}

class Hub {
    constructor(io) { 
        this.logger = new Logger();
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.onAcceptPickup = this.onAcceptPickup.bind(this);
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
 }

const hub = new Hub(io);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('request-pickup', hub.onRequestPickup);
    socket.on('driver-accept-pickup', hub.onAcceptPickup)

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

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});