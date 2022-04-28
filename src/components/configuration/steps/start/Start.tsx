import React, {useMemo} from "react";
import "../../../../assets/styles/StepStart.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import {ArrowRightCircleFill} from "react-bootstrap-icons";
import {ConfigurationStep, IAutoVacuumConfiguration} from "../../hooks/useConfiguration";

interface IStartProps {
    step: ConfigurationStep,
    allowRendering: boolean,
    vacuumConfiguration: IAutoVacuumConfiguration,
    showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void
}

const Start = (props: IStartProps) => {

    const renderLeftPart = () => (
        <Col className={"col-12 col-md-4 order-2 order-md-1 vacuum-background"}/>
    )

    const renderRightPart = () => (
        <Col className={"col-12"}>
            <Row>
                <h1 className={"mb-3 mb-md-3"}>Welcome <span
                    className={"username"}>Martin</span></h1>
            </Row>
            <Row>
                <h3 className={"mb-4 mb-md-5"}>Thanks for purchasing our <strong>AutoVacuum
                    v4</strong>
                </h3>
            </Row>
            <Row>
                <Col>
                    <Button onClick={props.showNextStep(props.vacuumConfiguration)}>
                        Start configuration <ArrowRightCircleFill className={"ms-2"} size={18}/>
                    </Button>
                </Col>
            </Row>
        </Col>
    )

    return useMemo(() => {
        const leftPart = renderLeftPart();
        const rightPart = renderRightPart();
        return (
            <div id={props.step} className={"fullscreen-window"}>
                <Container fluid className={"h-100"}>
                    <Row className={"h-100"}>
                        <Col className={"col-12 col-md-8 order-1 order-md-2"}>
                            <Row className={"me-3 ms-3 ms-md-5 d-flex h-100 align-items-center"}>
                                {leftPart}
                                {rightPart}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }, [props.allowRendering]);
}

export default Start;