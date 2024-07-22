import React from "react";
import { useState, useEffect } from "react";
import './Canvas.css';

export const Canvas = () => {
	let canvas: HTMLCanvasElement|null;
	let ctx: CanvasRenderingContext2D|null;

	const [myStrokeStyle, setMyStrokeStyle] = useState('');
  	const [myLineWidth, setMyLineWidth] = useState(0);
  	const [myuserName, setMyUserName] = useState('');


	let isPainting: boolean = false;
	let prevPos = { offsetX: 0, offsetY: 0 };

	useEffect(() => {
		if (canvas) {
			// Here we set up the properties of the canvas element. 
			canvas.width = 500;
			canvas.height = 500;
			ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

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

	let onMouseDown = ({nativeEvent}: React.MouseEvent<Element, MouseEvent>) => {
		prevPos = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		isPainting = true;
		
		const offSetData = { offsetX: nativeEvent.offsetX, offsetY: nativeEvent.offsetY };
		paint(prevPos, offSetData, myStrokeStyle);
	}

	let onMouseMove = ({ nativeEvent }: React.MouseEvent<Element, MouseEvent>) => {
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

	let paint = (prevPos: {offsetX: number, offsetY: number},
				currPos: {offsetX: number, offsetY: number}, 
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

	let endPaintEvent = () => {
		if (isPainting) {
			isPainting = false;
		}
	}

	let onColorClick = (e: React.MouseEvent<Element, MouseEvent>) => {
		setMyStrokeStyle(window.getComputedStyle(e.target as Element, null)
								.getPropertyValue("background-color"));
		setMyLineWidth(5);
		if (ctx) {
			ctx.lineWidth = 5;
		}
	}

	let eraserFunc = (e: React.MouseEvent<Element, MouseEvent>) => {
		setMyStrokeStyle('black');
		setMyLineWidth(20);
		if (ctx) {
			ctx.lineWidth = 20;
		}
	}


	return(
		<div className="body">
			<div className="palette">
				<div style={{
					backgroundColor: myStrokeStyle,
					borderRadius: '50%',
				}}></div>
				<div className="colorOption" style={{backgroundColor: 'black'}} onClick={onColorClick}></div>
				<div className="colorOption" style={{backgroundColor: 'red'}} onClick={onColorClick}></div>
				<div className="colorOption" style={{backgroundColor: 'green'}} onClick={onColorClick}></div>
				<div className="colorOption" style={{backgroundColor: 'yellow'}} onClick={onColorClick}></div>
				<div className="colorOption" style={{backgroundColor: 'blue'}} onClick={onColorClick}></div>
				<div className="colorOption" style={{backgroundColor: 'pink'}} onClick={onColorClick}></div>
				{/*<img src={EraserIcon} style={{height: '20px', width: '20px', border: '1px solid black'}}
					onClick={eraserFunc}></img>*/}
				<div style={{height: '20px', width: '20px', border: '1px solid black'}} onClick={eraserFunc}>E</div>
			</div>
			<div>
				<canvas className="canvas"
					// We use the ref attribute to get direct access to the canvas element. 
					ref={(ref) => (canvas = ref)}
					style={{position: 'absolute', display: 'inline-block'}}
					onMouseDown={onMouseDown}
					onMouseLeave={endPaintEvent}
					onMouseUp={endPaintEvent}
					onMouseMove={onMouseMove}
				/>
			</div>
		</div>
	)
};