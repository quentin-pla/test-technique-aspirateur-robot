import React, {useMemo} from "react";
import "../../../../assets/styles/StepRoomSize.scss";
import {Col, Container, Row} from "react-bootstrap";
import {clearLongPress} from "../../../../utils/utils";
import {ConfigurationStep, IAutoVacuumConfiguration} from "../../hooks/useConfiguration";
import useRoomSize from "./hooks/useRoomSize";
import useRoomSizeRendering from "./hooks/useRoomSizeRendering";

export interface IRoomSizeProps {
    step: ConfigurationStep,
    allowRendering: boolean,
    showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
    showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
    vacuumConfiguration: IAutoVacuumConfiguration
}

const RoomSize = (props: IRoomSizeProps) => {
    const state = useRoomSize(props);
    const rendering = useRoomSizeRendering({...props, ...state});

    return useMemo(() => {
        return (
            <div id={props.step} className={"fullscreen-window"} onMouseUp={clearLongPress}>
                <Container fluid className={"h-100 pb-md-5"}>
                    <Row className={"h-100"}>
                        <Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
                            {rendering.prevStepBtn}
                        </Col>
                        <Col className={"col-12 col-md-10 d-flex flex-column"}>
                            {rendering.header}
                            {rendering.room}
                            <div className={"move-step-container"}>
                                {rendering.prevStepBtn}
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
    }, [props.allowRendering, state.vacuumConfiguration, state.cellSize]);
}

export default RoomSize;