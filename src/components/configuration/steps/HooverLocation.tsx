import React, {useEffect, useMemo, useState} from "react";
import "./RoomConfiguration.css";
import "./HooverLocation.css";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {ArrowLeft} from "react-bootstrap-icons";
import {IHooverConfiguration} from "../Configuration";

/**
 * Hoover location configuration props
 */
interface IHooverLocationProps {
	render: boolean,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	showPreviousStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	hooverConfiguration: IHooverConfiguration
}

/**
 * Hoover location configuration
 */
const HooverLocation = (props: IHooverLocationProps) => {
	const [_grid, _setGrid] = useState<Array<Array<string>>>(new Array<Array<string>>())
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(props.hooverConfiguration);
	const [_cellSize, _setCellSize] = useState<number>(0);

	/**
	 * On render
	 */
	useEffect(() => {
		if (props.render) {
			_setHooverConfiguration({
				...props.hooverConfiguration,
				xLocation: 0,
				yLocation: 0,
			});
		}
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
		const grid = rows.map(row => columns.map(column => row + "," + column));
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
		const height = (400 / rows);
		const width = (500 / columns);
		return width > height ? height : width;
	}

	/**
	 * On select location
	 */
	const onSelectLocation = (row: number, column: number) => () => {
		_setHooverConfiguration(prevConfig => {
			let angle = prevConfig.angle;
			if (prevConfig.xLocation == row && prevConfig.yLocation == row)
				angle += 90;
			if (angle >= 360) angle = 0;
			return {
				...prevConfig,
				xLocation: column,
				yLocation: row,
				angle
			}
		});
	}

	/**
	 * Render grid
	 */
	const renderGrid = useMemo(() => {
		return _grid.map((row, rowIndex) => (
			<div key={"row-" + rowIndex} className={"room-grid-row"}>
				{row.map((column, columnIndex) => (
					<div key={"column-" + columnIndex} className={"room-grid-cell"}
					     onClick={onSelectLocation(rowIndex, columnIndex)}
					     style={{width: _cellSize + "px", height: _cellSize + "px"}}>
					</div>
				))}
			</div>
		))
	}, [_grid]);

	return useMemo(() => {
		const hooverImageStyle = {
			top: (_hooverConfiguration.yLocation * _cellSize) + "px",
			left: (_hooverConfiguration.xLocation * _cellSize) + "px",
			rotate: _hooverConfiguration.angle + "deg"
		}
		return (
			<div className={"fullscreen-window"}>
				<Button className={"go-back-btn"} onClick={props.showPreviousStep(_hooverConfiguration)}>
					<ArrowLeft size={30}/>
				</Button>
				<Container fluid className={"h-100 d-flex align-items-center justify-content-center"}>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-12 text-center mb-4"}>
							<h2>Place hoover in the room</h2>
							<span>Click on a cell to place the hoover</span>
						</Col>
						<Col className={"col-12 room-grid location-grid"}>
							<div className={"room-grid-delimiter"}>
								{renderGrid}
								<Image
									style={hooverImageStyle}
									className={"ihoover"}
									width={_cellSize + "px"}
									height={_cellSize + "px"}
									src={"/ihoover.svg"}
								/>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render, _hooverConfiguration, _grid]);
}

export default HooverLocation;