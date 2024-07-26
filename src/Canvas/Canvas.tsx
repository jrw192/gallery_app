import React from 'react';
import { useState, useEffect, ChangeEvent } from 'react';
import {Buffer} from 'buffer';
import './Canvas.css';

export const Canvas = () => {
	let canvas: HTMLCanvasElement | null;
	let ctx: CanvasRenderingContext2D | null;

	const [myStrokeStyle, setMyStrokeStyle] = useState('');
	const [myLineWidth, setMyLineWidth] = useState(0);

	let isPainting: boolean = false;
	let prevPos = { offsetX: 0, offsetY: 0 };

	useEffect(() => {
		if (canvas) {
			// Here we set up the properties of the canvas element. 
			canvas.width = 700;
			canvas.height = 500;
			ctx = canvas.getContext('2d');
			if (ctx) {
				clear();

				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.lineWidth = 5;
			}
		}
	}, []);

	useEffect(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.lineWidth = 5;
			}
		}
	}, [myStrokeStyle, myLineWidth]);

	let startPainting = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
		prevPos = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		isPainting = true;

		const offSetData = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		paint(prevPos, offSetData, myStrokeStyle);
	}

	let createLine = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
		if (isPainting) {
			const offsetData = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
			// Set the start and stop position of the paint event.
			const positionData = {
				start: { ...prevPos },
				stop: { ...offsetData },
			};
			paint(prevPos, offsetData, myStrokeStyle);
			prevPos = offsetData;
		}
	}

	let paint = (prevPos: { offsetX: number, offsetY: number },
		currPos: { offsetX: number, offsetY: number },
		strokeStyle: any) => {
		const { offsetX, offsetY } = currPos;
		const { offsetX: x, offsetY: y } = prevPos;

		if (ctx) {
			ctx.beginPath();
			ctx.strokeStyle = strokeStyle;
			// Move the the prevPosition of the mouse
			ctx.moveTo(x, y);
			// Draw a line to the current position of the mouse
			ctx.lineTo(offsetX, offsetY);
			// Visualize the line using the strokeStyle
			ctx.stroke();
			prevPos = { offsetX, offsetY };
		}
	}

	let stopPainting = () => {
		if (isPainting) {
			isPainting = false;
		}
	}

	let setColor = (e: React.MouseEvent<Element, MouseEvent>) => {
		setMyStrokeStyle(window.getComputedStyle(e.target as Element, null)
			.getPropertyValue('background-color'));
		setMyLineWidth(5);
		if (ctx) {
			ctx.lineWidth = 5;
		}
	}

	let erase = (e: React.MouseEvent<Element, MouseEvent>) => {
		setMyStrokeStyle('white');
		setMyLineWidth(20);
		if (ctx) {
			ctx.lineWidth = 20;
		}
	}

	let clear = () => {
		if (canvas && ctx) {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	let saveImage = async () => {
		console.log('saveImage');
		if (canvas) {
			let title = (document!.getElementById('titleInput') as HTMLInputElement).value;
			console.log('title:',title);
			const blob = await new Promise<Blob>((resolve) => {
				canvas!.toBlob((blob) => {
					resolve(blob!);
				}, 'image/png');
			});
			const file = new File([blob], title, { type: 'image/png' });

			// // Create FormData and append the file
			// const formData = new FormData();
			// formData.append('file', file);

			const buffer = await blob.arrayBuffer();


			fetch(`http://localhost:5000/saveimage/${title}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/octet-stream',
				},
				body: buffer,
			})
				.then(response => {
					return response;
				})
				.then(data => {
					console.log('data: ', data);
					return data;
				})
				.catch(error => console.error('Error:', error));
		}
	}

	const convertCanvasToFile = (canvas: HTMLCanvasElement): Promise<Blob> => {
		return new Promise((resolve) => {
			canvas.toBlob((blob: any) => {
				const file = new File([blob!], 'canvas-image.png', { type: 'image/png' });
				resolve(file);
			}, 'image/png');
		});
	};


	function dataURItoBlob(dataURI: any): Blob {
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for (let i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
	}


	return (
		<div className='body'>
			<input id="titleInput" placeholder={'untitled'} />
			<button onClick={() => clear()}>Start over</button>
			<button onClick={() => saveImage()}
			// disabled={!loggedIn}
			>Save</button>
			<div className='palette'>
				<div style={{
					backgroundColor: myStrokeStyle,
					borderRadius: '50%',
				}}></div>
				<div className='colorOption' style={{ backgroundColor: 'black' }} onClick={setColor}></div>
				<div className='colorOption' style={{ backgroundColor: 'red' }} onClick={setColor}></div>
				<div className='colorOption' style={{ backgroundColor: 'green' }} onClick={setColor}></div>
				<div className='colorOption' style={{ backgroundColor: 'yellow' }} onClick={setColor}></div>
				<div className='colorOption' style={{ backgroundColor: 'blue' }} onClick={setColor}></div>
				<div className='colorOption' style={{ backgroundColor: 'pink' }} onClick={setColor}></div>
				{/*<img src={EraserIcon} style={{height: '20px', width: '20px', border: '1px solid black'}}
					onClick={eraserFunc}></img>*/}
				<div style={{ height: '20px', width: '20px', border: '1px solid black' }} onClick={erase}>E</div>
			</div>
			<div>
				<canvas className='canvas'
					// We use the ref attribute to get direct access to the canvas element. 
					ref={(ref) => (canvas = ref)}
					style={{ position: 'absolute', display: 'inline-block' }}
					onMouseDown={startPainting}
					onMouseLeave={stopPainting}
					onMouseUp={stopPainting}
					onMouseMove={createLine}
				/>
			</div>
		</div>
	)
};