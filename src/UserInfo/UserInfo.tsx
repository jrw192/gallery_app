import React from "react";
import { useState, useEffect } from "react";
import './UserInfo.css';
import { SessionData } from '../types';
import { Login } from '../Login/Login';

export const UserInfo: React.FC<{
  handleSession: () => void;
  sessionData: SessionData
}> = ({ handleSession, sessionData }) => {
  const [showLogin, setShowLogin] = useState(false);
  let userLogout = () => {
    fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/logout/${sessionData.sid}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        handleSession();
        return data;
      })
      .catch(error => console.error('Error:', error));
  }

  let showLoginPanel = () => {
    setShowLogin(true);
  }

  let hideLoginPanel = () => {
    setShowLogin(false);
  }

  return (
    <div className='user-body'>
      {sessionData.name ? <div className='loggedin'>
        <span>welcome back, {sessionData.name}. </span>
        <button onClick={() => userLogout()}>logout</button>
      </div>
        : <div className='loggedout'>
          <span>who are you? </span>
          <button className='login-button' onClick={showLoginPanel}>login</button>
        </div>
      }

      {showLogin &&
        <Login handleSession={handleSession} handleClose={hideLoginPanel}
          sessionData={sessionData} />}
    </div>
  );
};
