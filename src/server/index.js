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
                console.log("EVENT:", dateFormatter(), `(${event})`, eventText)
                break;
            case "request-pickup-to-driver":
                eventText = `sending request ${payload.vendor.name}`
                console.log("EVENT:", dateFormatter(), `(${event})`, eventText)
                break;
         }
    }
}

class Hub {
    constructor(io) { 
        this.logger = new Logger();
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.io = io;
    }
    sendRequestPickup(payload) { 
        const event = "request-pickup-to-driver";
        this.logger.log(event, payload);
        const clients = io.sockets.adapter.rooms.get('drivers');
        console.log("in room drivers", clients)
        this.io.in("drivers").emit(event, payload);
        /*
        for (let c of clients) { 
            io.to(c).emit(event, payload)
        }
        */
    }
    onRequestPickup(payload) { 
        const event = "request-pickup";
        this.logger.log(event, payload);
        this.sendRequestPickup(payload);
    }
 }

const hub = new Hub(io);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('request-pickup', hub.onRequestPickup);

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