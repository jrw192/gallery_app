import { Link } from "react-router-dom";
import './Navigation.css';

export const Navigation = () => {
	return(
		<div className='navigation-body'>
			<span>what do you want to do? </span>
			<button><Link to={`/`}>view gallery</Link></button>
			<button><Link to={`/paint`}>send a postcard</Link></button>
		</div>
	)
};