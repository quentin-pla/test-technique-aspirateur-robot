import React, {useEffect, useMemo, useState} from "react";
import "./RoomConfiguration.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeft, ArrowRight, DashCircleFill, PlusCircleFill} from "react-bootstrap-icons";
import {IHooverConfiguration} from "../Configuration";

interface IRoomConfigurationProps {
	render: boolean,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	showPreviousStep: (hooverConfiguration: IHooverConfiguration) => () => void,
	hooverConfiguration: IHooverConfiguration
}

let _longPressTimeout: NodeJS.Timeout | undefined = undefined;
let _actionInterval: NodeJS.Timer | undefined = undefined;

/**
 * Room configuration
 */
const RoomConfiguration = (props: IRoomConfigurationProps) => {
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(props.hooverConfiguration);

	useEffect(() => {
		_setHooverConfiguration({...props.hooverConfiguration});
	}, [props.render])

	/**
	 * Start long press timeout (for plus/minus buttons)
	 * @param action action to execute in a loop
	 */
	const startLongPressTimeout = (action: () => void) => {
		if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
		_longPressTimeout = setTimeout(() => {
			if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
			_longPressTimeout = undefined;
			_actionInterval = setInterval(action, 100);
		}, 300)
	}

	/**
	 * Reset timeout and interval
	 */
	const resetTimeoutAndInterval = () => {
		if (!!_longPressTimeout) {
			clearTimeout(_longPressTimeout);
			_longPressTimeout = undefined;
		}
		if (!!_actionInterval) {
			clearInterval(_actionInterval);
			_actionInterval = undefined;
		}
	}

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
		const height = (400 / rows);
		const width = (500 / columns);
		return width > height ? height : width;
	}

	return useMemo(() => {
		const cellSize = getCellSize(_hooverConfiguration.roomLength, _hooverConfiguration.roomWidth);
		return (
			<div className={"fullscreen-window"} onMouseUp={resetTimeoutAndInterval}>
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
						</Col>
						<Col className={"col-12 room-grid"}>
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

export default RoomConfiguration;