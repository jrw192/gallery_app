import React from 'react';
import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import './Login.css';
import { SessionData } from '../SessionData';

interface LoginProps {
	handleSession: (data: SessionData) => void;
	sessionData: SessionData
}

export const Login: React.FC<LoginProps> = ({ handleSession, sessionData }) => {
	const [userData, setUserData] = useState<{ username: string, password: string }>({
		username: '',
		password: '',
	});
	const [updateNames, setUpdateNames] = useState(false);
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		getUserNames().then(n => setNames(n));
	}, [updateNames]);

	let handleUserLogin = () => {
		if (!names.includes(userData.username)) {
			createUser().then(() => {
				loginUser();
			});
		} else {
			loginUser();
		}
	}

	let loginUser = () => {
		console.log('login');
		fetch('http://localhost:5000/login', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then(response => {
				return response.json();
			})
			.then(data => {
				handleSession(data);
				return data;
			})
			.catch(error => {
				alert('incorrect password');
				return console.error('Error:', error);
			});
	}

	let createUser = () => {
		console.log('create user');
		return fetch('http://localhost:5000/createuser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then(response => {
				setUpdateNames(!updateNames);
				return response.json();
			})
			.catch(error => console.error('Error:', error));
	}

	let userLogout = () => {
		fetch(`http://localhost:5000/logout/${sessionData.sid}`)
			.then(response => {
				return response.json();
			})
			.then(data => {
				handleSession({ sid: '', name: '' });
				return data;
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
		return fetch('http://localhost:5000/names')
			.then(response => {
				return response.json();
			})
			.then(data => {
				data = data.map((nameObj: { username: string }) => {
					return nameObj.username;
				});
				return data;
			})
			.catch(error => console.error('Error:', error));
	}


	return (sessionData.name.length === 0 ?
		<div className='login-body'><div className='loggedout'>
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
		</div></div>

		: <div className='login-body'><div className='loggedin'>
			welcome back, {sessionData.name}.
			<button onClick={() => userLogout()}>Logout</button>
		</div></div>

	)
};