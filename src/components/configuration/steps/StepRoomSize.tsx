import React, {useEffect, useMemo, useState} from "react";
import "./StepRoomSize.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeft, ArrowRight, DashCircle, DashCircleFill, PlusCircle, PlusCircleFill} from "react-bootstrap-icons";
import {ConfigurationStep, IHooverConfiguration} from "../Configuration";
import {resetLongPressTimeout, startLongPressTimeout} from "../../../utils/utils";

interface IRoomConfigurationProps {
	step: ConfigurationStep,
	render: boolean,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	showPreviousStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	hooverConfiguration: IHooverConfiguration
}

/**
 * Room configuration
 */
const StepRoomSize = (props: IRoomConfigurationProps) => {
	const [_gridHeight] = useState<number>(400);
	const [_gridWidth] = useState<number>(500);
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(props.hooverConfiguration);

	/**
	 * On render
	 */
	useEffect(() => {
		if (props.render) _setHooverConfiguration({...props.hooverConfiguration});
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
	const onAddRows = (rowsToAdd: number) => () => {
		const action = () => _setHooverConfiguration(prevConfiguration => ({
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
	const onAddColumns = (columnsToAdd: number) => () => {
		const action = () => _setHooverConfiguration(prevConfiguration => ({
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
		const height = _gridHeight / rows;
		const width = _gridWidth / columns;
		return width > height ? height : width;
	}

	return useMemo(() => {
		const gridStyles = {
			maxHeight: _gridHeight + "px",
			minHeight: _gridHeight + "px",
			maxWidth: _gridWidth + "px",
			minWidth: _gridWidth + "px",
		}
		const cellSize = getCellSize(_hooverConfiguration.roomLength, _hooverConfiguration.roomWidth);
		return (
			<div id={props.step} className={"fullscreen-window"} onMouseUp={resetLongPressTimeout}>
				<Container fluid className={"h-100 d-flex align-items-center justify-content-center"}>
					<Button className={"go-back-btn"} onClick={props.showPreviousStep(_hooverConfiguration)}>
						<ArrowLeft size={30}/>
					</Button>
					<Button className={"go-next-btn"} onClick={props.showNextStep(_hooverConfiguration)}>
						<ArrowRight size={30}/>
					</Button>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-12 text-center mb-5"}>
							<h2>Configure your room</h2>
							<span>Long press <DashCircle size={15}/> or <PlusCircle size={15}/> to increase quickly room length and width</span>
						</Col>
						<Col className={"col-12 room-grid"} style={gridStyles}>
							<div className={"room-grid-y-btn"}>
								<Button className={"btn-grid-size"}>
									<div className={"d-flex justify-content-center align-items-center gap-3"}>
										<DashCircleFill onMouseDown={onAddColumns(-1)} className={"minus-btn"}
										                size={20}/>
										{_hooverConfiguration.roomWidth}m
										<PlusCircleFill onMouseDown={onAddColumns(1)} className={"plus-btn"} size={20}/>
									</div>
								</Button>
							</div>
							<div className={"room-grid-delimiter"}>
								<div className={"room-grid-x-btn"}>
									<Button className={"btn-grid-size row-btn"}>
										<div
											className={"d-flex flex-column justify-content-center align-items-center gap-3"}>
											<PlusCircleFill onMouseDown={onAddRows(1)} className={"plus-btn"}
											                size={20}/>
											{_hooverConfiguration.roomLength}m
											<DashCircleFill onMouseDown={onAddRows(-1)} className={"minus-btn"}
											                size={20}/>
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
									     width: (cellSize * _hooverConfiguration.roomWidth) + "px",
									     height: (cellSize * _hooverConfiguration.roomLength) + "px"
								     }}/>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render, _hooverConfiguration]);
}

export default StepRoomSize;