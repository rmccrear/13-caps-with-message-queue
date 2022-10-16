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
        switch (event) {
            case "request-pickup":
                const eventText = `${payload.vendor.name} is requesting pickup for ${payload.item.contents}.`
                console.log("EVENT:", dateFormatter(), `(${event})`, eventText)
         }
    }
}

class Hub {
    constructor() { 
        this.logger = new Logger();
        this.onRequestPickup = this.onRequestPickup.bind(this);
    }
    onRequestPickup(payload) { 
        const event = "request-pickup";
        this.logger.log(event, payload);
    }
 }

const hub = new Hub();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('request-pickup', hub.onRequestPickup);
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});