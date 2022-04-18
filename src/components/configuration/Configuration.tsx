import React, {useMemo, useState} from "react";
import "./Configuration.scss"
import StepRoomSize from "./steps/roomSize/StepRoomSize";
import StepStart from "./steps/start/StepStart";
import StepHooverLocation from "./steps/hooverLocation/StepHooverLocation";
import StepTest from "./steps/test/StepTest";
import NavBar from "./NavBar";

/**
 * Configuration steps
 */
export enum ConfigurationStep {
	Start = "step-start",
	RoomSize = "step-room-size",
	HooverLocation = "step-hoover-location",
	Test = "step-test"
}

/**
 * Hoover orientation
 */
export enum HooverOrientation {
	North = 0,
	East = 90,
	South = 180,
	West = 270,
}

/**
 * Hoover configuration properties
 */
export interface IHooverConfiguration {
	roomLength: number,
	roomWidth: number,
	xLocation: number,
	yLocation: number,
	orientation: HooverOrientation
}

/**
 * Steps order
 */
const stepsOrder = [
	ConfigurationStep.Start,
	ConfigurationStep.RoomSize,
	ConfigurationStep.HooverLocation,
	ConfigurationStep.Test
]

/**
 * Default configuration
 */
const defaultConfiguration: IHooverConfiguration = {
	roomLength: 5, roomWidth: 5, xLocation: 0, yLocation: 0, orientation: 0
}

/**
 * Configuration
 */
export const Configuration = () => {
	const [_stepIndex, _setStepIndex] = useState<number>(0);
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>(defaultConfiguration);

	/**
	 * Show next step
	 * @param hooverConfiguration hoover configuration in current step
	 */
	const showNextStep = (hooverConfiguration: IHooverConfiguration) => () => {
		_setHooverConfiguration({...hooverConfiguration});
		_setStepIndex(_prevIndex => _prevIndex + 1);
	}

	/**
	 * Show previous step
	 * @param hooverConfiguration hoover configuration in current step
	 */
	const showPreviousStep = (hooverConfiguration: IHooverConfiguration) => () => {
		_setHooverConfiguration({...hooverConfiguration});
		_setStepIndex(_prevIndex => _prevIndex - 1);
	}

	return useMemo(() => {
		const width = (stepsOrder.length * 100) + "%";
		const childWidth = 100 / stepsOrder.length;
		const transform = "translate(-" + (childWidth * _stepIndex) + "%)";
		const navbarStyle = {width: childWidth + "%", transform: "translate(" + (100 * _stepIndex) + "%)"};
		return (
			<div className={"main-container no-select"} style={{transform: transform, width: width}}>
				<NavBar step={stepsOrder[_stepIndex]} style={navbarStyle}/>
				<StepStart
					step={ConfigurationStep.Start}
					render={stepsOrder[_stepIndex] === ConfigurationStep.Start}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}/>
				<StepRoomSize
					step={ConfigurationStep.RoomSize}
					render={stepsOrder[_stepIndex] === ConfigurationStep.RoomSize}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
				<StepHooverLocation
					step={ConfigurationStep.HooverLocation}
					render={stepsOrder[_stepIndex] === ConfigurationStep.HooverLocation}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
				<StepTest
					step={ConfigurationStep.Test}
					render={stepsOrder[_stepIndex] === ConfigurationStep.Test}
					hooverConfiguration={_hooverConfiguration}
					showPreviousStep={showPreviousStep}/>
			</div>
		)
	}, [_stepIndex]);
}