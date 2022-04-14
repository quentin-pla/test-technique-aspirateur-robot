import React, {useMemo, useState} from "react";
import "./RoomConfiguration.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeftCircle, DashCircleFill, PlusCircleFill} from "react-bootstrap-icons";

interface IRoomConfigurationProps {
	showNextStep: () => void,
	showPreviousStep: () => void,
}

/**
 * Room configuration
 */
const RoomConfiguration = (props: IRoomConfigurationProps) => {
	const [_rows, _setRows] = useState<number>(2);
	const [_columns, _setColumns] = useState<number>(3);

	/**
	 * Add a row
	 */
	const addRow = () => _setRows(_prevRows => _prevRows + 1);

	/**
	 * Add a column
	 */
	const addColumn = () => _setColumns(_prevColumns => _prevColumns + 1);

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
		const cellSize = getCellSize(_rows, _columns);
		return (
			<div className={"fullscreen-window"}>
				<Container fluid className={"h-100"}>
					<Row className={"h-100 d-flex align-items-center justify-content-center"}>
						<Col className={"col-12 text-center"}>
							<h2>Configure your room</h2>
						</Col>
						<Col className={"col-12 room-grid"}>
							<div className={"room-grid-y-label"}>{_columns}m</div>
							<div className={"room-grid-delimiter"}>
								<div className={"room-grid-x-label"}>
									{_rows}m
								</div>
								{Array.from(Array(_rows).keys()).map(row => (
									<div key={"row-" + row} className={"room-grid-row"}>
										{Array.from(Array(_columns).keys()).map(column => (
											<div key={"column-" + column} className={"room-grid-cell"}
											     style={{width: cellSize, height: cellSize}}>
											</div>
										))}
									</div>
								))}
							</div>
						</Col>
						<Col className={"col-12 d-flex justify-content-center align-items-center gap-3"}>
							<Button className={"btn-grid-size"} onClick={addColumn}>
								<div className={"d-flex justify-content-center align-items-center gap-3"}>
									<PlusCircleFill size={20}/>
									Width
									<DashCircleFill size={20}/>
								</div>
							</Button>
							<Button className={"btn-grid-size"} onClick={addRow}>
								<div className={"d-flex justify-content-center align-items-center gap-3"}>
									<PlusCircleFill size={20}/>
									Length
									<DashCircleFill size={20}/>
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
	}, [_rows, _columns]);
}

export default RoomConfiguration;