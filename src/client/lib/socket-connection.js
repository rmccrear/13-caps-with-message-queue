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

class HubConnection extends SocketConnection {
    constructor(){
        super();
        console.log('NEW HUB CONNECTION')
        this.emit("join-as-logger");
        this.socket.on("log", (logLine) => {
            console.log("LOG", logLine);
            if(this.onLogCallback){
                this.onLogCallback(logLine);
            }
        });
    }

    setOnLogCallback(fn){
        this.onLogCallback = fn;
    }
}

class VendorConnection extends SocketConnection { 
    constructor(id, name) {
        super();
        this.onPickupWasAccepted();
        this.onItemWasDelivered();
        this.emit("join-as-vendor", {id, name});
    }
    requestPickup(item, vendor) { 
        console.log("VendorConnection sending request-pickup event to server")
        this.emit("request-pickup", { item, vendor });
    }

    onPickupWasAccepted(){
        this.socket.on("pickup-accepted", (payload)=>{
            if(this.onPickupWasAcceptedCallback){
                this.onPickupWasAcceptedCallback(payload);
            }
        })
    }

    setOnPickupWasAcceptedCallback(fn){
        this.onPickupWasAcceptedCallback = fn;
    }

    onItemWasDelivered(){
        this.socket.on("delivered", (payload)=>{
            if(this.onItemWasDeliveredCallback){
                this.onItemWasDeliveredCallback(payload);
            }
        })
    }

    setOnItemWasDeliveredCallback(fn){
        this.onItemWasDeliveredCallback = fn;
    }


}


class DriverConnection extends SocketConnection {

    constructor(id, name) {
        super();
        this.emit("join-as-driver", {id, name});
        this.driver = { id, name };
        this.onRequestPickup = this.onRequestPickup.bind(this);
        this.onPickupWasAccepted = this.onPickupWasAccepted.bind(this);
        this.onPickupWasAccepted();
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

    acceptPickup({item}) {
        this.socket.emit("driver-accept-pickup", { item, driver: this.driver });
    }

    rejectPickup({item}) {
        this.socket.emit("driver-reject-pickup", { item, driver: this.driver });
    }

    onPickupWasAccepted(){
        this.socket.on("pickup-accepted", (payload) => {
            console.log("DriverConnection receiving pickup-accepted")
            if (this.onPickupWasAcceptedCallback) {
                this.onPickupWasAcceptedCallback(payload);
            }
         } )
    }

    setOnPickupWasAcceptedCallback(fn){
        this.onPickupWasAcceptedCallback = fn;
    }

    deliveryComplete({item}) {
        this.socket.emit("delivery-complete", { item, driver: this.driver });
    }

}

export { SocketConnection, VendorConnection, DriverConnection, HubConnection };