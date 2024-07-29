import React from "react";
import {useState, useEffect} from "react";
import './App.css';
import {Home} from './Home/Home';
import {Canvas} from './Canvas/Canvas';
import {Login} from './Login/Login';
import {Navigation} from './Navigation/Navigation';
import { Outlet } from "react-router-dom";

const App = () => {
  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleSession = (e: any) => {
    setSessionId(e.sid);
    setUserName(e.name);
  }
  const getCurrentSession = () => {
    fetch('http://localhost:5000/session')
			.then(response => {
				return response.json();
			})
			.then(data => {
				return data;
			})
			.catch(error => console.error('Error:', error));
  }

  return (
    <div className="App">
      <Navigation/>
      <button onClick={() => getCurrentSession()}>zz</button>
      this is the parent page
      <Login handleSession={handleSession} sid={sessionId} name={userName}/>
      <Outlet context={{sessionData: {sessionId, userName}}}/>
    </div>
  );
};
export default App;