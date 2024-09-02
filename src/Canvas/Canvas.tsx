import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import './Canvas.css';
import { SessionData, Postcard } from '../types';
import { Loader, LoaderOptions } from 'google-maps';
import { Details} from '../Details/Details';

export const Canvas = () => {
	const colorOptions = ['black', 'brown', 'red', 'orange', 'yellow',
		'green', 'blue', 'purple', 'pink', 'lightgreen', 'lightblue', 'peachpuff'];
	let canvas: HTMLCanvasElement | null;
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const { sessionData } = useOutletContext<{ sessionData: SessionData }>();

	const [brushColor, setBrushColor] = useState('');
	const [brushSize, setBrushSize] = useState(5);

	let isPainting: boolean = false;
	let prevPos = { offsetX: 0, offsetY: 0 };

	useEffect(() => {
		console.log('restoring session');
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
				ctxRef.current.lineWidth = brushSize;
			}
		}
	}, [brushColor, brushSize]);

	let startPainting = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
		prevPos = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		isPainting = true;

		const offSetData = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		paint(prevPos, offSetData, brushColor);
	}

	let createLine = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
		if (isPainting) {
			const offsetData = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
			// Set the start and stop position of the paint event.
			const positionData = {
				start: { ...prevPos },
				stop: { ...offsetData },
			};
			paint(prevPos, offsetData, brushColor);
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
		setBrushColor(window.getComputedStyle(e.target as Element, null)
			.getPropertyValue('background-color'));
		if (ctxRef.current) {
			ctxRef.current.lineWidth = 5;
		}
	}

	let erase = (e: React.MouseEvent<Element, MouseEvent>) => {
		setBrushColor('white');
		if (ctxRef.current) {
			ctxRef.current.lineWidth = 20;
		}
	}

	let clear = () => {
		if (canvas && ctxRef.current) {
			ctxRef.current.fillStyle = 'white';
			ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
		}
	}

	let saveData = async (postcardData: Postcard) => {
		if (canvas) {
			let postcardId = crypto.randomUUID();
			postcardData.id = postcardId;
			const blob = await new Promise<Blob>((resolve) => {
				canvas!.toBlob((blob) => {
					resolve(blob!);
				}, 'image/png');
			});
			const buffer = await blob.arrayBuffer();

			fetch(`http://localhost:5000/saveimage/${postcardId}`, {
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

			fetch(`http://localhost:5000/savepostcard/${postcardId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				  },
				body: JSON.stringify(postcardData),
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

	let handleBrushSize = (e: any) => {
		setBrushSize(e.target.value);
	}

	return (
		<div className='canvas-body'>
			<Details clear={clear} saveData={saveData} />
			<div className='brush-section'>
				<input className='range' type='range'
					value={brushSize}
					onChange={handleBrushSize}
					min='1' max='50'>
				</input>
				<span className='dot' style={{
					height: `${brushSize}px`,
					width: `${brushSize}px`,
				}}></span>
				<span>brush size</span>
			</div>
			<div className='palette'>
				<div style={{
					backgroundColor: brushColor,
					borderRadius: '50%',
				}}></div>
				{colorOptions.map((c) => <div className='colorOption' style={{ backgroundColor: c }} onClick={setColor}></div>)}
				<div style={{ height: '20px', width: '20px', border: '1px solid black' }}
					onClick={erase}>E</div>
			</div>
			<div className='canvas-wrapper'>
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
		</div >
	)
};