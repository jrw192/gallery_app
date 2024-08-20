import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import './Canvas.css';
import { SessionData } from '../SessionData';


export const Canvas = () => {
	let canvas: HTMLCanvasElement | null;
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const { sessionData } = useOutletContext<{ sessionData: SessionData }>();

	const [myStrokeStyle, setMyStrokeStyle] = useState('');
	const [myLineWidth, setMyLineWidth] = useState(0);
	const [painted, setPainted] = useState(false);

	let isPainting: boolean = false;
	let prevPos = { offsetX: 0, offsetY: 0 };

	useEffect(() => {
		console.log('sessionData:', sessionData);
	}, [sessionData]);

	useEffect(() => {
		if (canvas) {
			// Here we set up the properties of the canvas element. 
			canvas.width = 700;
			canvas.height = 500;
			ctxRef.current = canvas.getContext('2d');
			if (ctxRef.current) {
				clear();

				ctxRef.current.lineJoin = 'round';
				ctxRef.current.lineCap = 'round';
				ctxRef.current.lineWidth = 5;
			}
		}
	}, []);

	useEffect(() => {
		// set canvas ctx line properties when strokestyle or linewidth changes
		if (canvas) {
			if (ctxRef.current) {
				ctxRef.current.lineJoin = 'round';
				ctxRef.current.lineCap = 'round';
				ctxRef.current.lineWidth = 5;
			}
		}
	}, [myStrokeStyle, myLineWidth]);

	let startPainting = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
		setPainted(true);
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

		if (ctxRef.current) {
			ctxRef.current.beginPath();
			ctxRef.current.strokeStyle = strokeStyle;
			// Move the the prevPosition of the mouse
			ctxRef.current.moveTo(x, y);
			// Draw a line to the current position of the mouse
			ctxRef.current.lineTo(offsetX, offsetY);
			// Visualize the line using the strokeStyle
			ctxRef.current.stroke();
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
		if (ctxRef.current) {
			ctxRef.current.lineWidth = 5;
		}
	}

	let erase = (e: React.MouseEvent<Element, MouseEvent>) => {
		setMyStrokeStyle('white');
		setMyLineWidth(20);
		if (ctxRef.current) {
			ctxRef.current.lineWidth = 20;
		}
	}

	let clear = () => {
		setPainted(false);
		if (canvas && ctxRef.current) {
			ctxRef.current.fillStyle = 'white';
			ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	let saveImage = async () => {
		if (canvas) {
			let title = (document!.getElementById('titleInput') as HTMLInputElement).value + ' by ' + sessionData.name;
			const blob = await new Promise<Blob>((resolve) => {
				canvas!.toBlob((blob) => {
					resolve(blob!);
				}, 'image/png');
			});
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
					return data;
				})
				.catch(error => console.error('Error:', error));
		}
	}

	return (
		<div className='canvas-body'>
			<form className='controls'>
				<input id="titleInput" placeholder={'untitled'} required />
				<button onClick={() => clear()}>Start over</button>
				<button id="save-button" onClick={() => saveImage()}
					disabled={sessionData.name.length === 0 || !painted}
				>Save</button>
				{sessionData.name.length === 0 && <Tooltip
					anchorSelect="#save-button"
					content="log in to save"
				/>}
				{(!painted && sessionData.name.length > 0) && <Tooltip
					anchorSelect="#save-button"
					content="paint something before saving"
				/>}
			</form>
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