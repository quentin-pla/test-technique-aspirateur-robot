import React from "react";
import "./RoomConfiguration.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowLeftCircle} from "react-bootstrap-icons";

interface IRoomConfigurationProps {
	showNextStep: () => void,
	showPreviousStep: () => void,
}

/**
 * Room configuration
 */
const RoomConfiguration = (props: IRoomConfigurationProps) => {
	return (
		<div className={"fullscreen-window"}>
			<Container fluid className={"h-100"}>
				<Row className={"h-100 d-flex align-items-center justify-content-center"}>
					<Col className={"col-12 text-center"}>
						<h2>Configure your room</h2>
					</Col>
					<Col className={"col-12 room-grid"}>
						<div className={"room-grid-row"}>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
						</div>
						<div className={"room-grid-row"}>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
						</div>
						<div className={"room-grid-row"}>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
							<div className={"room-grid-cell"}/>
						</div>
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

export default RoomConfiguration;