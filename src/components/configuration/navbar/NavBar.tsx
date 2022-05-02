import {Col, Container, Row} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import React, {CSSProperties, useMemo} from "react";
import useNavbar from "./useNavbar";
import {ConfigurationStep} from "../hooks/useConfiguration";

interface INavBarProps {
    step: ConfigurationStep,
    style: CSSProperties,
}

const NavBar = (props: INavBarProps) => {
    const {step, style} = props;
    const {logoColor} = useNavbar(step);

    return useMemo(() => (
        <Container fluid className={"navbar"} style={style}>
            <Row className={"w-100"}>
                <Col className={"col-4 vacuum-background"}>
                    <Row>
                        <Col className={"col-12"}>
                            <span id={"logo"} style={{color: logoColor}}>AutoVacuum</span>
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
                </Col>
            </Row>
        </Container>
    ), [logoColor, style]);
}

export default NavBar;