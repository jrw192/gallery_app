import { useState, useEffect } from 'react';
import './Gallery.css';

export const Gallery = () => {
	const [images, setImages] = useState<{key: string, url: string}[]>([]);

	useEffect(() => {
		getImages();
	}, []);

	let getImages = () => {
		fetch('http://localhost:5000/images')
		.then(response => {
			return response.json();
		})
		.then(data => {
			setImages(data);
			return data;
		})
		.catch(error => console.error('Error:', error));
	}



	return (
		<div className='gallery-body'>
			<div className='image-grid'>
		      {images.map((image) => (
		        <div className="item"  key={image.key}>
					<img className='image' src={image.url}/>
					<div className="title">{image.key}</div>
				</div>
		      ))}	
    	</div>
		</div>
	)
};