import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import { Link } from "react-router-dom";
import './Navigation.css';

export const Navigation = () => {
	return(
		<div className='navigation-body'>
			<button><Link to={`/home`}>Home</Link></button>
			<button><Link to={`/paint`}>Paint</Link></button>
			<button><Link to={`/gallery`}>Gallery</Link></button>
		</div>
	)
};