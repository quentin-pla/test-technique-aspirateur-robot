import React, {useEffect, useMemo, useState} from "react";
import "./StepHooverLocation.scss";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {ArrowLeft, ArrowRight, CaretUpFill} from "react-bootstrap-icons";
import {ConfigurationStep, HooverOrientation, IHooverConfiguration} from "../Configuration";

/**
 * Hoover location configuration props
 */
interface IStepHooverLocationProps {
	step: ConfigurationStep,
	render: boolean,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	showPreviousStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	hooverConfiguration: IHooverConfiguration
}

/**
 * Hoover location configuration
 */
const StepHooverLocation = (props: IStepHooverLocationProps) => {
	const [_gridHeight] = useState<number>(400);
	const [_gridWidth] = useState<number>(500);
	const [_grid, _setGrid] = useState<Array<Array<string>>>(new Array<Array<string>>())
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(props.hooverConfiguration);
	const [_cellSize, _setCellSize] = useState<number>(0);
	const [_hooverRotation, _setHooverRotation] = useState<number>(0);
	const [_allowTransitions, _setAllowTransitions] = useState<boolean>(false);

	/**
	 * On render
	 */
	useEffect(() => {
		if (!props.render) return;
		_setAllowTransitions(false);
		setTimeout(() => _setAllowTransitions(true), 300);
		const isXLocationOut = props.hooverConfiguration.xLocation >= props.hooverConfiguration.roomWidth;
		const isYLocationOut = props.hooverConfiguration.yLocation >= props.hooverConfiguration.roomLength;
		const config = {...props.hooverConfiguration}
		if (isXLocationOut) config.xLocation = props.hooverConfiguration.roomWidth - 1;
		if (isYLocationOut) config.yLocation = props.hooverConfiguration.roomLength - 1;
		_setHooverConfiguration(config);
	}, [props.render])

	/**
	 * On hoover configuration change
	 */
	useEffect(() => {
		// Do not update grid if size is the same
		if (_hooverConfiguration.roomLength === _grid.length &&
			_hooverConfiguration.roomWidth === _grid[0].length) return;
		const rows = Array.from(Array(_hooverConfiguration.roomLength).keys());
		const columns = Array.from(Array(_hooverConfiguration.roomWidth).keys());
		const grid = rows.map(row => columns.map(column => column + "," + row));
		const cellSize = getCellSize(_hooverConfiguration.roomLength, _hooverConfiguration.roomWidth);
		_setCellSize(cellSize);
		_setGrid(grid);
	}, [_hooverConfiguration])

	/**
	 * Get cell size
	 * @param rows number of rows
	 * @param columns number of columns
	 */
	const getCellSize = (rows: number, columns: number): number => {
		const height = _gridHeight / rows;
		const width = _gridWidth / columns;
		return width > height ? height : width;
	}

	/**
	 * On rotate hoover
	 */
	const onRotateHoover = () => {
		_setHooverRotation(prevAngle => prevAngle + 90);
		_setHooverConfiguration(prevConfig => {
			let angle = prevConfig.orientation + 90;
			if (angle >= 360) angle = 0;
			let orientation: HooverOrientation;
			switch (angle) {
				case 0:
					orientation = HooverOrientation.North;
					break;
				case 90:
					orientation = HooverOrientation.East;
					break;
				case 180:
					orientation = HooverOrientation.South;
					break;
				case 270:
					orientation = HooverOrientation.West;
					break;
				default:
					throw new Error("Angle " + angle + "deg does not correspond to any orientation");
			}
			return {...prevConfig, orientation}
		});
	}

	/**
	 * On select location
	 */
	const onSelectLocation = (location: string) => () => {
		const [x, y] = location.split(",");
		const xLocation = parseInt(x);
		const yLocation = parseInt(y);
		_setHooverConfiguration(prevConfig => {
			return {...prevConfig, xLocation, yLocation}
		});
	}

	/**
	 * Render grid
	 */
	const renderGrid = useMemo(() => {
		return _grid.reverse().map((row, rowIndex) => (
			<div key={"row-" + rowIndex} className={"room-grid-row"}>
				{row.map((column, columnIndex) => (
					<div key={"column-" + columnIndex} className={"room-grid-cell"}
					     onClick={onSelectLocation(row[columnIndex])}
					     style={{width: _cellSize + "px", height: _cellSize + "px"}}>
					</div>
				))}
			</div>
		))
	}, [_grid]);

	return useMemo(() => {
		const gridStyles = {
			maxHeight: _gridHeight + "px",
			minHeight: _gridHeight + "px",
			maxWidth: _gridWidth + "px",
			minWidth: _gridWidth + "px",
		}
		const hooverImageStyle = {
			bottom: (_hooverConfiguration.yLocation * _cellSize) + "px",
			left: (_hooverConfiguration.xLocation * _cellSize) + "px",
			transform: "rotate(" + _hooverRotation + "deg) scale(0.7)"
		}
		return (
			<div id={props.step} className={"fullscreen-window " + (_allowTransitions ? "" : "no-transition")}>
				<Button className={"go-back-btn"} onClick={props.showPreviousStep(_hooverConfiguration)}>
					<ArrowLeft size={30}/>
				</Button>
				<Button className={"go-next-btn"} onClick={props.showNextStep(_hooverConfiguration)}>
					<ArrowRight size={30}/>
				</Button>
				<Container fluid className={"h-100 d-flex align-items-center justify-content-center"}>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-12 text-center mb-4"}>
							<h2>Place hoover in the room</h2>
							<span>Click on a cell to place the hoover</span>
							<br/>
							<span>Click on the hoover to rotate it</span>
						</Col>
						<Col className={"col-12 room-grid"} style={gridStyles}>
							<div className={"room-grid-delimiter"}>
								{renderGrid}
								<div className={"ihoover"} style={hooverImageStyle}>
									<Image
										onClick={onRotateHoover}
										width={_cellSize + "px"}
										height={_cellSize + "px"}
										src={"/ihoover.svg"}
									/>
									<CaretUpFill className={"direction-arrow"}/>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render, _hooverConfiguration, _grid, _allowTransitions]);
}

export default StepHooverLocation;