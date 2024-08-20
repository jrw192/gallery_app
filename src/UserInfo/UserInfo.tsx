import React from "react";
import { useState, useEffect } from "react";
import './UserInfo.css';
import { SessionData } from '../SessionData';
import { Login } from '../Login/Login';

export const UserInfo: React.FC<{handleSession: () => void;
	sessionData: SessionData}> = ({ handleSession, sessionData }) => {
  const [showLogin, setShowLogin] = useState(false);
  let userLogout = () => {
    fetch(`http://localhost:5000/logout/${sessionData.sid}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // setSessionData({
        //   sid: data.sessionID,
        //   name: ''
        // });
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
          welcome back, {sessionData.name}.
          <button onClick={() => userLogout()}>Logout</button>
        </div>
          : <button className='login-button' onClick={showLoginPanel}>Login</button>}
        {showLogin &&
          <Login handleSession={handleSession} handleClose={hideLoginPanel}
            sessionData={sessionData} />}
      </div>
  );
};