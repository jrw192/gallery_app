import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import './Login.css';

interface LoginProps {
	handleSession: (data: {sid: string, userName: string}) => void;
	name: string;
	sid: string;
}

export const Login: React.FC<LoginProps> = ({ handleSession, name, sid }) => {
	const [userData, setUserData] = useState<{ username: string, password: string }>({
		username: '',
		password: '',
	});

	const id = 'jod';
	const [names, setNames] = useState<string[]>([]);

	useEffect(() => {
		getUserNames();
	}, []);

	let handleUserLogin = () => {
		if (!names.includes(userData.username)) {
			createUser();
		}
		loginUser();
	}

	let loginUser = () => {
		console.log('loginuser');
		fetch('http://localhost:5000/login', {
			method: 'POST',
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
		fetch('http://localhost:5000/createuser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
			.then(response => {
				console.log('response: ',response);
				return response.json();
			})
			.then(data => {
				return data;
			})
			.catch(error => console.error('Error:', error));
	}

	let userLogout = () => {
		fetch(`http://localhost:5000/logout/${sid}`)
			.then(response => {
				return response.json();
			})
			.then(data => {
				handleSession({sid: '', userName: ''});
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
		fetch('http://localhost:5000/names')
			.then(response => {
				return response.json();
			})
			.then(data => {
				data = data.map((nameObj: { username: string }) => {
					return nameObj.username;
				});
				setNames(data);
			})
			.catch(error => console.error('Error:', error));
	}


	return (sid.length == 0 ?
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
			welcome back, {name}.
			<button onClick={() => userLogout()}>Logout</button>
		</div></div>

	)
};