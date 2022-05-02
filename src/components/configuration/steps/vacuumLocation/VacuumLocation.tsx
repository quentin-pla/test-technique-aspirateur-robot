import React, {useMemo} from "react";
import "../../../../assets/styles/StepVacuumLocation.scss";
import {Col, Container, Image, Row} from "react-bootstrap";
import {CaretUpFill} from "react-bootstrap-icons";
import {ConfigurationStep, IAutoVacuumConfiguration} from "../../hooks/useConfiguration";
import useVacuumLocation from "./hooks/useVacuumLocation";
import useVacuumLocationRendering from "./hooks/useVacuumLocationRendering";

export interface IVacuumLocationProps {
    step: ConfigurationStep,
    allowRendering: boolean,
    showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
    showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
    vacuumConfiguration: IAutoVacuumConfiguration
}

const VacuumLocation = (props: IVacuumLocationProps) => {
    const {step, allowRendering} = props;
    const state = useVacuumLocation(props);
    const rendering = useVacuumLocationRendering({...props, ...state});

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
                                        <Image
                                            onClick={state.handleVacuumRotation}
                                            width={state.cellSize + "px"}
                                            height={state.cellSize + "px"}
                                            src={"autovacuum.svg"}
                                        />
                                        <CaretUpFill className={"direction-arrow"}/>
                                    </div>
                                </div>
                            </div>
                            <div className={"move-step-container"}>
                                {rendering.previousStepBtn}
                                {rendering.nextStepBtn}
                            </div>
                        </Col>
                        <Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
                            {rendering.nextStepBtn}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }, [allowRendering, state.vacuumConfiguration, state.grid, state.allowTransitions, state.cellSize]);
}

export default VacuumLocation;