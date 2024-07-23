import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import './Login.css';

export const Login = () => {
	const [userData, setUserData] = useState<{username: string, password: string}>({
		username: '',
		password: '',
	});

  const [loggedIn, setLoggedIn] = useState(false);

	const id = 'jod';
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		// validateUser();
		// handleUserLogin();
		getUserNames();
	}, []);

	let validateUser = () => {
		fetch(`http://localhost:5000/user/${userData.username}`)
      .then(response => {
      	return response.json();
      })
      .then(data => {
        if (userData.password == data[0].password) {
        	console.log('passwords match');
        	setLoggedIn(true);
        } else {
        	console.log('incorrect password');
        	setLoggedIn(false);
        }

      })
      .catch(error => console.error('Error:', error));
	}

	let handleUserLogin = () => {
		console.log('handleUserLogin');
		if (names.includes(userData.username)) {
			// this user already exists, do password verification
			console.log('user found');
			validateUser();
		}
		else {
			// create a new user
			console.log('create new user');
			createUser();
		}
	}

	let createUser = () => {
		fetch(`http://localhost:5000/users`, {
			method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
		})
      .then(response => {
      	// console.log('response: ', response);
        setLoggedIn(true);
      	return response.json();
      })
      .then(data => {
      	// console.log(data);
      })
      .catch(error => console.error('Error:', error));
	}

	let formModelChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData(data => ({
	      ...data,
	      [name]: value
	    }));
	}

	let getUserNames = () => {
		fetch('http://localhost:5000/names')
			.then(response => {
	      	return response.json();
	      })
	      .then(data => {
	        data = data.map((nameObj: {username: string}) => {
	        	return nameObj.username;
	        });
	        setNames(data);
	      })
	      .catch(error => console.error('Error:', error));
	}


	return(
		<div className='login-body'>
			<input placeholder={'Username'}
					required={true}
					name='username'
					value={userData.username}
					onChange={formModelChange}></input>
			<input placeholder={'Password'}
					required={true}
					name='password'
					value={userData.password}
					onChange={formModelChange}></input>
			<button onClick={() => handleUserLogin()}>Login</button>
		</div>
	)
};