import React from 'react';
import Board from './containers/board'
import Handler from './containers/gameHandler'
import GameMessage from './containers/gameMessage'

import logo from './logo.svg';
import './App.css';


const App = () => {
  return (
    <div className="App">
      <GameMessage />
      <Handler />
      <Board />
      <span>Created by <a href='https://benchanhp.me'>@hkbenchan</a></span>
    </div>
  );
}

export default App;
