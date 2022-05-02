import React, {useMemo} from "react";
import "../../../../assets/styles/StepTest.scss";
import {Col, Container, Image, Row} from "react-bootstrap";
import useTest from "./hooks/useTest";
import {ConfigurationStep, IAutoVacuumConfiguration} from "../../hooks/useConfiguration";
import useTestRendering from "./hooks/useTestRendering";

export interface ITestProps {
	step: ConfigurationStep,
	allowRendering: boolean,
	showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	vacuumConfiguration: IAutoVacuumConfiguration
}

const Test = (props: ITestProps) => {
	const {step, vacuumConfiguration} = props;
	const state = useTest(props);
	const rendering = useTestRendering({...props, ...state});

	return useMemo(() => {
		return (
			<div id={step} className={"fullscreen-window " + (state.allowTransitions ? "" : "no-transition")}>
				<Container fluid className={"h-100 pb-md-5"}>
					<Row className={"h-100"}>
						<Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
							{rendering.previousStepBtn}
						</Col>
						<Col className={"col-12 col-md-10 d-flex flex-column"}>
							{rendering.header}
							<div ref={state.gridRef} className={"room-grid"}>
								<div className={"room-grid-delimiter"}>
									{rendering.grid}
									<div className={"autovacuum"} style={rendering.configuration.vacuumImage.style}>
										<Image width={state.cellSize + "px"} height={state.cellSize + "px"}
											   src={"autovacuum.svg"}/>
									</div>
								</div>
							</div>
							<div className={"move-step-container"}>
								{rendering.previousStepBtn}
							</div>
						</Col>
						<Col className={"col-1 d-none d-md-flex"}/>
					</Row>
				</Container>
				{rendering.executionResult}
			</div>
		)
	}, [vacuumConfiguration, state.grid, state.allowTransitions, state.instructions, state.animationConfiguration, state.showExecutionResult, state.cellSize]);
}

export default Test;