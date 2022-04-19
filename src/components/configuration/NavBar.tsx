import {Col, Container, Row} from "react-bootstrap";
import {PersonCircle} from "react-bootstrap-icons";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import {ConfigurationStep} from "./Configuration";

/**
 * NavBar props
 */
interface INavBarProps {
	step: ConfigurationStep,
	style: CSSProperties,
}

/**
 * NavBar
 */
const NavBar = (props: INavBarProps) => {
	const [_logoColor, _setLogoColor] = useState<string>("white");

	/**
	 * Handle window resize
	 */
	useEffect(() => {
		const handleResize = () => {
			let logoColor = getLogoColor();
			_setLogoColor(logoColor);
		}
		window.addEventListener('resize', handleResize);
	}, [])

	/**
	 * Handle step change
	 */
	useEffect(() => {
		let logoColor = getLogoColor();
		if (logoColor === _logoColor) return;
		_setLogoColor(logoColor);
	}, [props.step]);

	/**
	 * Get logo color
	 */
	const getLogoColor = () => {
		let logoColor: string;
		const isOnMobile = document.body.offsetWidth < 768;
		if (isOnMobile) logoColor = "black";
		else logoColor = props.step === ConfigurationStep.Start ? "white" : "black";
		return logoColor;
	}

	return useMemo(() => (
		<Container fluid className={"navbar"} style={props.style}>
			<Row className={"w-100"}>
				<Col className={"col-4 hoover-background"}>
					<Row>
						<Col className={"col-12"}>
							<span id={"logo"} style={{color: _logoColor}}>iHoover</span>
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
	), [_logoColor, props.style]);
}

export default NavBar;