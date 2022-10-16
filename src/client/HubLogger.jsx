import React, { Component } from 'react';
import { HubConnection } from './lib/socket-connection';

class HubLogger extends Component {
    constructor(props) {
        super(props);
        this.relay = new HubConnection();
        this.relay.setOnLogCallback((logLine)=>{
            this.addToLog(logLine);
        })
    }
    state = { logs: [] }
    addToLog(message) {
        console.log("add to log", message)
        const logs = this.state.logs;
        logs.unshift(message);
        this.setState({...this.state, logs});
    }
    render() { 
        const logs = this.state.logs;
        return ( <div className="hub-logger">
            <table>
            <thead><tr><td>Logs:</td></tr></thead>
            <tbody>
            {logs.map((line) => {
                return (<tr key={line}><td>{line}</td></tr>)
            })}
            </tbody>
            </table>
        </div> );
    }
}
 
export default HubLogger;