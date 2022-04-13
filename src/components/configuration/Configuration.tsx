import React, {useState} from "react";
import "./Configuration.css"
import {Button, Col, Container, Row,} from "react-bootstrap";
import {ArrowRightCircleFill, PersonCircle} from 'react-bootstrap-icons';
import GridSelection from "./steps/GridSelection";

/**
 * Configuration
 */
export const Configuration = () => {
	return (
		<Container fluid className={"h-100 overflow-hidden"}>
			<Row className={"w-100 h-100"}>
				<Col className={"col-4 hoover-background"} style={{backgroundColor: "red"}}>
					<Row>
						<Col className={"col-12"}>
							<span id={"logo"}>iHoover</span>
						</Col>
					</Row>
				</Col>
				<Col className={"col-8"}>
					<Row>
						<Col className={"col-12 d-flex px-3 py-3 justify-content-end align-items-center"}>
							<h6 className={"me-2 mb-0"}>Martin</h6>
							<PersonCircle size={25}/>
						</Col>
					</Row>
					<Row className={"ms-5 d-flex h-100 align-items-center"}>
						<Col className={"col-12"}>
							<Col className={"col-12"}>
								<h1 className={"mb-4"}>Welcome <span className={"text-brown"}>Martin</span></h1>
							</Col>
							<Col className={"col-12"}>
								<h3 className={"mb-5"}>Thanks for purchasing our <strong>iHoover v4</strong></h3>
							</Col>
							<Col className={"col-12"}>
								<Button>
									<div className={"d-flex justify-content-center align-items-center"}>
										Start configuration <ArrowRightCircleFill className={"ms-2"} size={18}/>
									</div>
								</Button>
							</Col>
						</Col>
					</Row>
				</Col>
			</Row>
			<GridSelection/>
		</Container>
	);
}