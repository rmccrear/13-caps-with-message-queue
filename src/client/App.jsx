import React from 'react';
import ReactDOM from 'react-dom/client';

const e = React.createElement;

import Hub from "./Hub";
import VendorCollection from "./VendorCollection";
import DriverCollection from './DriverCollection';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="tree-diagram">
            <ul>
                <li className="tree-diagram__root">
                    <Hub></Hub> 
                    <ul>
                        <li>
                            <VendorCollection></VendorCollection>       
                        </li>
                        <li>
                            <DriverCollection></DriverCollection>
                        </li>
                    </ul>
                </li>

            </ul>
         
        </div>
    );
  }
}

const domContainer = document.querySelector('#react_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(App));
