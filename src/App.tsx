import { useState, useEffect } from "react";
import './App.css';
import { UserInfo } from './UserInfo/UserInfo';
import { Navigation } from './Navigation/Navigation';
import { Outlet } from "react-router-dom";
import { SessionData } from './types';

const App = () => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sid: '',
    name: '',
  });

  useEffect(() => {
    setSessionCookieIfExists();
  }, []);

  const setSessionCookieIfExists = () => {
    fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/session`, {
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

  let userLogout = () => {
    fetch(`${process.env.SERVER_HOSTNAME}/logout/${sessionData.sid}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        setSessionData({
          sid: data.sessionID,
          name: ''
        });
        return data;
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <div className="App">
      <div className='top-bar'>
        <Navigation />
        <UserInfo handleSession={() => setSessionCookieIfExists()}
          sessionData={sessionData} />
      </div>
      <Outlet context={{ sessionData: sessionData }} />
    </div>
  );
};
export default App;