import React, {useMemo, useState} from "react";
import "./RoomConfiguration.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeft, DashCircleFill, PlusCircleFill} from "react-bootstrap-icons";

interface IHooverLocationProps {
	showNextStep: () => void,
	showPreviousStep: () => void,
}

/**
 * Room configuration
 */
const HooverLocation = (props: IHooverLocationProps) => {
	const [_rows, _setRows] = useState<number>(2);
	const [_columns, _setColumns] = useState<number>(3);

	/**
	 * Add a number of rows
	 */
	const addRow = (count: number) => () => _setRows(_prevRows => _prevRows + count);

	/**
	 * Add a number of columns
	 */
	const addColumn = (count: number) => () => _setColumns(_prevColumns => _prevColumns + count);

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
				<Button className={"go-back-btn"} onClick={props.showPreviousStep}>
					<ArrowLeft size={30}/>
				</Button>
				<Container fluid className={"h-100 d-flex align-items-center justify-content-center"}>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-12 text-center mb-5"}>
							<h2>Configure your room</h2>
						</Col>
						<Col className={"col-12 room-grid"}>
							<div className={"room-grid-y-label"}>
								<Button className={"btn-grid-size"}>
									<div className={"d-flex justify-content-center align-items-center gap-3"}>
										<PlusCircleFill onClick={addColumn(1)} className={"plus-btn"} size={20}/>
										{_columns}m
										<DashCircleFill onClick={addColumn(-1)} className={"minus-btn"} size={20}/>
									</div>
								</Button>
							</div>
							<div className={"room-grid-delimiter"}>
								<div className={"room-grid-x-label"}>
									<Button className={"btn-grid-size row-btn"}>
										<div
											className={"d-flex flex-column justify-content-center align-items-center gap-3"}>
											<PlusCircleFill onClick={addRow(1)} className={"plus-btn"} size={20}/>
											{_rows}m
											<DashCircleFill onClick={addRow(-1)} className={"minus-btn"} size={20}/>
										</div>
									</Button>
								</div>
								<div className={"room-grid-center-label"}>
									My room
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
					</Row>
				</Container>
			</div>
		)
	}, [_rows, _columns]);
}

export default HooverLocation;