import React from "react";
import {useState, useEffect} from "react";
import './App.css';
import {Home} from './Home/Home';
import {Canvas} from './Canvas/Canvas';
import {Login} from './Login/Login';
import {Navigation} from './Navigation/Navigation';
import { Outlet } from "react-router-dom";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <Navigation/>
      this is the parent page
      <Login />
      <Outlet />
    </div>
  );
};
export default App;