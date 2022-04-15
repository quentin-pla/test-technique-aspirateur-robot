import React, {useEffect, useMemo, useState} from "react";
import "./RoomConfiguration.css";
import "./HooverLocation.css";
import {Button, Col, Container, Row} from "react-bootstrap";
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
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(props.hooverConfiguration);

	useEffect(() => {
		_setHooverConfiguration({...props.hooverConfiguration});
	}, [props.render])

	/**
	 * Get cell size
	 * @param rows number of rows
	 * @param columns number of columns
	 */
	const getCellSize = (rows: number, columns: number): string => {
		const height = (400 / rows);
		const width = (500 / columns);
		const size = width > height ? height : width;
		return size + "px";
	}

	return useMemo(() => {
		const cellSize = getCellSize(_hooverConfiguration.roomLength, _hooverConfiguration.roomWidth);
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
								{Array.from(Array(_hooverConfiguration.roomLength).keys()).map(row => (
									<div key={"row-" + row} className={"room-grid-row"}>
										{Array.from(Array(_hooverConfiguration.roomWidth).keys()).map(column => (
											<div key={"column-" + column} className={"room-grid-cell"}
											     style={{width: cellSize, height: cellSize}}>
											</div>
										))}
									</div>
								))}
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render, _hooverConfiguration]);
}

export default HooverLocation;