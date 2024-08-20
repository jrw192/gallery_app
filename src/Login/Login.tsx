import React from 'react';
import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import './Login.css';
import { SessionData } from '../SessionData';

interface LoginProps {
	handleSession: () => void;
	handleClose: () => void;
	sessionData: SessionData
}

export const Login: React.FC<LoginProps> = ({ handleSession, handleClose, sessionData }) => {
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
				handleSession();
				handleClose();
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

	return (
		<div className='login-body'>
			<div className='close' onClick={() => handleClose()}>X</div>
			<div className='login-content'>
				log in to existing account, or create new account if username doesn't exist.
				<input className='user-input'
					placeholder={'Username'}
					required={true}
					name='username'
					value={userData.username}
					onChange={formModelChange}></input>
				<input className='password-input'
					placeholder={'Password'}
					required={true}
					name='password'
					value={userData.password}
					onChange={formModelChange}></input>
				<button className='login-button'
					onClick={() => handleUserLogin()}>
					Login
				</button>
			</div>
		</div>
	)
};