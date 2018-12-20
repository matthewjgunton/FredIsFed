import React, { Component } from 'react';


import Calendar from './components/Calendar.js';
import FedStatus from './components/FedStatus.js';

class App extends Component {

  render() {
    return (
      <div className="App">
        <h1>Fred Is Fed</h1>
        <Calendar />
        <FedStatus />
      </div>
    );
  }
}

export default App;
