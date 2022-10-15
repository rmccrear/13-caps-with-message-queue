import React from 'react';
import ReactDOM from 'react-dom/client';

const e = React.createElement;

import Hub from "./Hub";
import Vendor from "./Vendor";
import Driver from "./Driver";

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
                            <Vendor></Vendor>       
                        </li>
                        <li>
                            <Driver></Driver>
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
