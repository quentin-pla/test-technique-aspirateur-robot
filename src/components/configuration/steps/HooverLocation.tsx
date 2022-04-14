import React, {useState} from "react";
import "./RoomConfiguration.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeftCircle} from "react-bootstrap-icons";

interface IHooverLocationProps {
	showNextStep: () => void,
	showPreviousStep: () => void,
}

/**
 * Room configuration
 */
const HooverLocation = (props: IHooverLocationProps) => {
	const [rows, setRows] = useState(1);
	const [columns, setColumns] = useState(1);

	const addRow = () => setRows(prevRows => prevRows + 1);

	const addColumn = () => setColumns(prevColumns => prevColumns + 1);

	return (
		<div className={"fullscreen-window"}>
			<Container fluid className={"h-100"}>
				<Row className={"h-100 d-flex align-items-center justify-content-center"}>
					<Col className={"col-12 text-center"}>
						<h2>Configure your room</h2>
					</Col>
					<Col className={"col-12 room-grid"}>
						{Array.from(Array(rows).keys()).map(row => {
							return (
								<div key={"row-" + row} className={"room-grid-row"}>
									{Array.from(Array(columns).keys()).map(column => {
										const columnSize = (((columns > rows ? 600 : 400) - (columns * 2)) / columns) + "px";
										return (
											<div key={"columns-" + column}
											     className={"room-grid-cell"}
											     style={{width: columnSize, height: columnSize}}
											/>
										)
									})}
								</div>
							)
						})}
					</Col>
					<Col className={"col-12 d-flex justify-content-center align-items-center gap-3"}>
						<Button onClick={addColumn}>
							<div className={"d-flex justify-content-center align-items-center"}>
								Width
							</div>
						</Button>
						<Button onClick={addRow}>
							<div className={"d-flex justify-content-center align-items-center"}>
								Length
							</div>
						</Button>
					</Col>
					<Col className={"col-12 d-flex justify-content-center align-items-center"}>
						<Button onClick={props.showPreviousStep}>
							<div className={"d-flex justify-content-center align-items-center"}>
								<ArrowLeftCircle className={"me-2"} size={18}/> Back
							</div>
						</Button>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default HooverLocation;