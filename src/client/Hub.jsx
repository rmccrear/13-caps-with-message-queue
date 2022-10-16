import React, { Component } from 'react';

import { SocketConnection } from './lib/socket-connection';

class Hub extends Component {
    constructor(props) {
        super(props);
        const io = new SocketConnection();
    }
    state = {  }
    render() { 
        return (<div className="hub-container">
            Hub
        </div> );
    }
}
 
export default Hub;