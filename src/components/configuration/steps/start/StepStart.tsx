import React, {useMemo} from "react";
import "./StepStart.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowRightCircleFill} from "react-bootstrap-icons";
import {ConfigurationStep, IHooverConfiguration} from "../../Configuration";

/**
 * Start step props
 */
interface IStartProps {
	step: ConfigurationStep,
	render: boolean,
	hooverConfiguration: IHooverConfiguration,
	showNextStep: (hooverConfiguration: IHooverConfiguration) => () => void
}

/**
 * Start step
 */
const StepStart = (props: IStartProps) => {
	return useMemo(() => {
		return (
			<div id={props.step} className={"fullscreen-window"}>
				<Container fluid className={"h-100"}>
					<Row className={"h-100"}>
						<Col className={"col-12 col-md-4 order-2 order-md-1 hoover-background"}/>
						<Col className={"col-12 col-md-8 order-1 order-md-2"}>
							<Row className={"me-3 ms-3 ms-md-5 d-flex h-100 align-items-center"}>
								<Col className={"col-12"}>
									<Row>
										<h1 className={"mb-3 mb-md-3"}>Welcome <span
											className={"username"}>Martin</span></h1>
									</Row>
									<Row>
										<h3 className={"mb-4 mb-md-5"}>Thanks for purchasing our <strong>iHoover
											v4</strong>
										</h3>
									</Row>
									<Row>
										<Col>
											<Button onClick={props.showNextStep(props.hooverConfiguration)}>
												Start configuration <ArrowRightCircleFill className={"ms-2"} size={18}/>
											</Button>
										</Col>
									</Row>
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