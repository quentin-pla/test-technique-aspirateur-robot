import React, {useEffect, useMemo, useRef, useState} from "react";
import "./StepRoomSize.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeft, ArrowRight, DashCircle, DashCircleFill, PlusCircle, PlusCircleFill} from "react-bootstrap-icons";
import {ConfigurationStep, IAutoVacuumConfiguration} from "../../Configuration";
import {resetLongPressTimeout, startLongPressTimeout} from "../../../../utils/utils";

/**
 * Room size step props
 */
interface IStepRoomSizeProps {
	step: ConfigurationStep,
	render: boolean,
	showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	vacuumConfiguration: IAutoVacuumConfiguration
}

/**
 * Room size step
 */
const StepRoomSize = (props: IStepRoomSizeProps) => {
	const [_cellSize, _setCellSize] = useState<number>(0);
	const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IAutoVacuumConfiguration>(props.vacuumConfiguration);
	const gridRef = useRef<HTMLDivElement>(null);

	/**
	 * Handle window resize
	 */
	useEffect(() => {
		const handleResize = () => {
			const cellSize = getCellSize(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
			_setCellSize(cellSize);
		}
		if (props.render) window.addEventListener('resize', handleResize);
		else window.removeEventListener('resize', handleResize);
	}, [props.render])

	/**
	 * Handle vacuum configuration change
	 */
	useEffect(() => {
		const cellSize = getCellSize(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
		_setCellSize(cellSize);
	}, [_vacuumConfiguration])

	/**
	 * Handle render
	 */
	useEffect(() => {
		if (props.render) _setVacuumConfiguration({...props.vacuumConfiguration});
	}, [props.render])

	/**
	 * Add rows to a value
	 * @param rows current rows
	 * @param rowsToAdd rows to add
	 */
	const addRows = (rows: number, rowsToAdd: number): number => {
		let newValue = rows + rowsToAdd;
		if (newValue > 100) newValue = 100;
		else if (newValue < 1) newValue = 1;
		return newValue;
	}

	/**
	 * Add columns to a value
	 * @param columns current columns
	 * @param columnsToAdd columns to add
	 */
	const addColumns = (columns: number, columnsToAdd: number): number => {
		let newValue = columns + columnsToAdd;
		if (newValue > 100) newValue = 100;
		else if (newValue < 1) newValue = 1;
		return newValue;
	}

	/**
	 * On press button to add rows
	 * @param rowsToAdd number of rows to add
	 */
	const handleAddRows = (rowsToAdd: number) => () => {
		const action = () => _setVacuumConfiguration(prevConfiguration => ({
			...prevConfiguration,
			roomLength: addRows(prevConfiguration.roomLength, rowsToAdd)
		}));
		startLongPressTimeout(action);
		action();
	}

	/**
	 * On press button to add columns
	 * @param columnsToAdd number of columns to add
	 */
	const handleAddColumns = (columnsToAdd: number) => () => {
		const action = () => _setVacuumConfiguration(prevConfiguration => ({
			...prevConfiguration,
			roomWidth: addColumns(prevConfiguration.roomWidth, columnsToAdd)
		}));
		startLongPressTimeout(action);
		action();
	}

	/**
	 * Get cell size
	 * @param rows number of rows
	 * @param columns number of columns
	 */
	const getCellSize = (rows: number, columns: number): number => {
		if (!gridRef.current) return 0;
		const gridHeight = gridRef.current.offsetHeight - 100;
		const gridWidth = gridRef.current.offsetWidth - 150;
		const cellHeight = gridHeight / rows;
		const cellWidth = gridWidth / columns;
		return cellWidth > cellHeight ? cellHeight : cellWidth;
	}

	return useMemo(() => {
		const isOnMobile = document.body.offsetWidth < 768;
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
		return (
			<div id={props.step} className={"fullscreen-window"} onMouseUp={resetLongPressTimeout}>
				<Container fluid className={"h-100 pb-md-5"}>
					<Row className={"h-100"}>
						<Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
							{goBackButton}
						</Col>
						<Col className={"col-12 col-md-10 d-flex flex-column"}>
							<div className={"d-flex flex-column text-center mb-2 text-center"}>
								<h2>Configure your room</h2>
								{
									isOnMobile ?
										<p>Press <DashCircle size={15}/> or <PlusCircle size={15}/> to increase room
											length and width</p>
										:
										<p>Long press <DashCircle size={15}/> or <PlusCircle size={15}/> to increase
											quickly room length and width</p>
								}
							</div>
							<div ref={gridRef} className={"room-grid"}>
								<div className={"room-grid-y-btn"}>
									<Button className={"btn-grid-size"}>
										<div className={"d-flex justify-content-center align-items-center gap-3"}>
											<DashCircleFill
												size={20}
												className={"minus-btn"}
												onMouseDown={handleAddColumns(-1)}
											/>
											{_vacuumConfiguration.roomWidth}m
											<PlusCircleFill
												size={20}
												className={"plus-btn"}
												onMouseDown={handleAddColumns(1)}
											/>
										</div>
									</Button>
								</div>
								<div className={"room-grid-delimiter"}>
									<div className={"room-grid-x-btn"}>
										<Button className={"btn-grid-size row-btn"}>
											<div
												className={"d-flex flex-column justify-content-center align-items-center gap-3"}>
												<PlusCircleFill
													size={20}
													className={"plus-btn"}
													onMouseDown={handleAddRows(1)}
												/>
												{_vacuumConfiguration.roomLength}m
												<DashCircleFill
													size={20}
													className={"minus-btn"}
													onMouseDown={handleAddRows(-1)}
												/>
											</div>
										</Button>
									</div>
									<div className={"fill-absolute overflow-hidden"}>
										<div className={"room-grid-center-label"}>
											My room
										</div>
									</div>
									<div className={"room-grid-grow-div"}
									     style={{
										     width: (_cellSize * _vacuumConfiguration.roomWidth) + "px",
										     height: (_cellSize * _vacuumConfiguration.roomLength) + "px"
									     }}/>
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
	}, [props.render, _vacuumConfiguration, _cellSize]);
}

export default StepRoomSize;