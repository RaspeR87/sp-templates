import * as React from 'react';

import './App.css';
import 'office-ui-fabric-react/dist/css/fabric.min.css';

import { Fabric } from 'office-ui-fabric-react/lib/Fabric';

class App extends React.Component {
  public render() {
    return (
      <div className="myReactApp">
        <Fabric>
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm12">
                <h1>Welcome to React on SharePoint Application Page</h1>
              </div>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm12">
                To get started, edit <code>src/App.tsx</code> and save to reload.
              </div>
            </div>
          </div>
        </Fabric>
      </div>
    );
  }
}

export default App;
