import React from "react";
import { useState, useEffect } from "react";
import './App.css';
import { Home } from './Home/Home';
import { Canvas } from './Canvas/Canvas';
import { Login } from './Login/Login';
import { Navigation } from './Navigation/Navigation';
import { Outlet } from "react-router-dom";
import { SessionData } from './SessionData';

const App = () => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sid: '',
    name: '',
  });

  useEffect(() => {
    setSessionCookieIfExists();
  }, [])

  const setSessionCookieIfExists = () => {
    fetch('http://localhost:5000/session', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.session.passport) {
          setSessionData({
            sid: data.sessionID,
            name: data.session.passport.user
          });
        } else {
          setSessionData({
            sid: data.sessionID,
            name: ''
          });
        }
        return data;
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <div className="App">
      <Navigation />
      this is the parent page
      <Login handleSession={() => setSessionCookieIfExists()}
        sessionData={sessionData} />
      <Outlet context={{ sessionData: sessionData }} />
    </div>
  );
};
export default App;