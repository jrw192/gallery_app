import { useState, useEffect } from 'react';
import './Gallery.css';
import { Postcard as PostcardType } from '../types';
import { Postcard } from '../Postcard/Postcard';

export const Gallery = () => {
	const [images, setImages] = useState<{key: string, url: string}[]>([]);
	const [postcards, setPostcards] = useState<PostcardType[]>([]);

	useEffect(() => {
		getImages();
		getPostcards();
	}, []);

	let getImages = () => {
		fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/images`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			setImages(data);
			return data;
		})
		.catch(error => console.error('Error:', error));
	}

	let getPostcards = () => {
		fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/getpostcards`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			setPostcards(data);
			return data;
		})
		.catch(error => console.error('Error:', error));
	}

	let getPostcardByKey = (key: string) => {
		const postcard = postcards.find((postcard) => postcard.id === key) ?? {
			id: '',
			creator: '',
			location: '',
			date: new Date(),
			title: '',
			message: '',
		} as PostcardType;
		return postcard
	}



	return (
		<div className='gallery-body'>
			<p className='gallery-title'>postcard gallery</p>
			<div className='image-grid'>
		      {images.map((image) => (
				<Postcard postcard={getPostcardByKey(image.key)} image={image} />
		      ))}	
    	</div>
		</div>
	)
};
