import React, {useMemo} from "react";
import "./StepStart.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowRightCircleFill, PersonCircle} from "react-bootstrap-icons";
import {ConfigurationStep, IHooverConfiguration} from "../Configuration";

/**
 * Start configuration page props
 */
interface IStartProps {
	step: ConfigurationStep,
	render: boolean,
	hooverConfiguration: IHooverConfiguration,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void
}

/**
 * Start configuration page
 */
const StepStart = (props: IStartProps) => {
	return useMemo(() => {
		return (
			<div id={props.step} className={"fullscreen-window"}>
				<Container fluid className={"h-100"}>
					<Row className={"h-100"}>
						<Col className={"col-4 hoover-background"}>
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
										<h3 className={"mb-5"}>Thanks for purchasing our <strong>iHoover v4</strong>
										</h3>
									</Col>
									<Col className={"col-12"}>
										<Button onClick={props.showNextStep(props.hooverConfiguration)}>
											<div className={"d-flex justify-content-center align-items-center"}>
												Start configuration <ArrowRightCircleFill className={"ms-2"} size={18}/>
											</div>
										</Button>
									</Col>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}, [props.render]);
}

export default StepStart;