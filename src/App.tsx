import { useState, useEffect } from "react";
import './App.css';
import { UserInfo } from './UserInfo/UserInfo';
import { Navigation } from './Navigation/Navigation';
import { Outlet, useLocation } from "react-router-dom";
import { SessionData } from './types';
import { Gallery } from './Gallery/Gallery';
import logo from './logo.png';


const App = () => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sid: '',
    name: '',
  });

  useEffect(() => {
    setSessionCookieIfExists();
    console.log(sessionData);
  }, []);

  const setSessionCookieIfExists = () => {
    fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/session`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        console.log('setSessionCookieIfExistsResponse', response);
        return response.json();
      })
      .then(data => {
        if (data.session.passport) {
          console.log('setSessionCookieIfExists', data);
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
      <img className='logo' src={logo} alt='logo'></img>
      <div className='top-bar'>
        <UserInfo handleSession={() => setSessionCookieIfExists()}
          sessionData={sessionData} />
        <Navigation />
      </div>
      {
        useLocation().pathname === '/' && <Gallery />
      }
      <Outlet context={{ sessionData: sessionData }} />
    </div>
  );
};
export default App;