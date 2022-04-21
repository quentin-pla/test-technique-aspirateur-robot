import React, {useEffect, useMemo, useRef, useState} from "react";
import "./StepVacuumLocation.scss";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {ArrowLeft, ArrowRight, CaretUpFill} from "react-bootstrap-icons";
import {ConfigurationStep, IAutoVacuumConfiguration, VacuumOrientation} from "../../Configuration";

/**
 * Vacuum location step props
 */
interface IStepVacuumLocationProps {
	step: ConfigurationStep,
	render: boolean,
	showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	vacuumConfiguration: IAutoVacuumConfiguration
}

/**
 * Vacuum location step
 */
const StepVacuumLocation = (props: IStepVacuumLocationProps) => {
	const [_grid, _setGrid] = useState<Array<Array<string>>>(new Array<Array<string>>())
	const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IAutoVacuumConfiguration>(props.vacuumConfiguration);
	const [_cellSize, _setCellSize] = useState<number>(0);
	const [_vacuumRotation, _setVacuumRotation] = useState<number>(0);
	const [_allowTransitions, _setAllowTransitions] = useState<boolean>(false);
	const gridRef = useRef<HTMLDivElement>(null);

	/**
	 * Handle window resize
	 */
	useEffect(() => {
		const handleResize = () => {
			const cellSize = getCellSize(props.vacuumConfiguration.roomLength, props.vacuumConfiguration.roomWidth);
			_setCellSize(cellSize);
		}
		if (props.render) {
			window.addEventListener('resize', handleResize);
			console.log("add")
		} else {
			window.removeEventListener('resize', handleResize);
			console.log("remove")
		}
	}, [props.render])

	/**
	 * Handle render
	 */
	useEffect(() => {
		if (!props.render) return;
		_setAllowTransitions(false);
		setTimeout(() => _setAllowTransitions(true), 300);
		const isXLocationOut = props.vacuumConfiguration.xLocation >= props.vacuumConfiguration.roomWidth;
		const isYLocationOut = props.vacuumConfiguration.yLocation >= props.vacuumConfiguration.roomLength;
		const config = {...props.vacuumConfiguration}
		if (isXLocationOut) config.xLocation = props.vacuumConfiguration.roomWidth - 1;
		if (isYLocationOut) config.yLocation = props.vacuumConfiguration.roomLength - 1;
		_setVacuumConfiguration(config);
	}, [props.render])

	/**
	 * Handle vacuum configuration change
	 */
	useEffect(() => {
		// Do not update grid if size is the same
		if (_vacuumConfiguration.roomLength === _grid.length &&
			_vacuumConfiguration.roomWidth === _grid[0].length) return;
		const rows = Array.from(Array(_vacuumConfiguration.roomLength).keys());
		const columns = Array.from(Array(_vacuumConfiguration.roomWidth).keys());
		const grid = rows.map(row => columns.map(column => column + "," + row));
		const cellSize = getCellSize(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
		_setCellSize(cellSize);
		_setGrid(grid);
	}, [_vacuumConfiguration])

	/**
	 * Get cell size
	 * @param rows number of rows
	 * @param columns number of columns
	 */
	const getCellSize = (rows: number, columns: number): number => {
		if (!gridRef.current) return 0;
		const gridHeight = gridRef.current.offsetHeight - 50;
		const gridWidth = gridRef.current.offsetWidth - 50;
		const cellHeight = gridHeight / rows;
		const cellWidth = gridWidth / columns;
		return cellWidth > cellHeight ? cellHeight : cellWidth;
	}

	/**
	 * Handle rotate vacuum
	 */
	const handleRotateVacuum = () => {
		_setVacuumRotation(prevAngle => prevAngle + 90);
		_setVacuumConfiguration(prevConfig => {
			let angle = prevConfig.orientation + 90;
			if (angle >= 360) angle = 0;
			let orientation: VacuumOrientation;
			switch (angle) {
				case 0:
					orientation = VacuumOrientation.North;
					break;
				case 90:
					orientation = VacuumOrientation.East;
					break;
				case 180:
					orientation = VacuumOrientation.South;
					break;
				case 270:
					orientation = VacuumOrientation.West;
					break;
				default:
					throw new Error("Angle " + angle + "deg does not correspond to any orientation");
			}
			return {...prevConfig, orientation}
		});
	}

	/**
	 * Handle select location
	 */
	const handleSelectLocation = (location: string) => () => {
		const [x, y] = location.split(",");
		const xLocation = parseInt(x);
		const yLocation = parseInt(y);
		_setVacuumConfiguration(prevConfig => {
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
					     onClick={handleSelectLocation(row[columnIndex])}
					     style={{width: _cellSize + "px", height: _cellSize + "px"}}>
					</div>
				))}
			</div>
		))
	}, [_grid, _cellSize]);

	return useMemo(() => {
		const goBackButton = (
			<Button className={"move-step-btn"} onClick={props.showPreviousStep(_vacuumConfiguration)}>
				<ArrowLeft size={30}/>
			</Button>
		)
		const goNextButton = (
			<Button className={"move-step-btn"} onClick={props.showNextStep(_vacuumConfiguration)}>
				<ArrowRight size={30}/>
			</Button>
		)
		const vacuumImageStyle = {
			bottom: (_vacuumConfiguration.yLocation * _cellSize) + "px",
			left: (_vacuumConfiguration.xLocation * _cellSize) + "px",
			transform: "rotate(" + _vacuumRotation + "deg) scale(0.7)"
		}
		return (
			<div id={props.step} className={"fullscreen-window " + (_allowTransitions ? "" : "no-transition")}>
				<Container fluid className={"h-100 pb-md-5"}>
					<Row className={"h-100"}>
						<Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
							{goBackButton}
						</Col>
						<Col className={"col-12 col-md-10 d-flex flex-column"}>
							<div
								className={"d-flex flex-column justify-content-center align-items-center mb-2 text-center "}>
								<h2>Place vacuum in the room</h2>
								<p>To place the vacuum, click on a cell</p>
								<p>Select the orientation by clicking on the vacuum</p>
							</div>
							<div ref={gridRef} className={"room-grid"}>
								<div className={"room-grid-delimiter"}>
									{renderGrid}
									<div className={"autovacuum"} style={vacuumImageStyle}>
										<Image
											onClick={handleRotateVacuum}
											width={_cellSize + "px"}
											height={_cellSize + "px"}
											src={"autovacuum.svg"}
										/>
										<CaretUpFill className={"direction-arrow"}/>
									</div>
								</div>
							</div>
							<div className={"move-step-container"}>
								{goBackButton}
								{goNextButton}
							</div>
						</Col>
						<Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
							{goNextButton}
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render, _vacuumConfiguration, _grid, _allowTransitions, _cellSize]);
}

export default StepVacuumLocation;