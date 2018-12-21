import React, { Component } from 'react';


import Calendar from './components/Calendar.js';
import FedStatus from './components/FedStatus.js';

class App extends Component {

  render() {
    return (
      <div className="App">
        <FedStatus />
        <Calendar />

      </div>
    );
  }
}

export default App;
