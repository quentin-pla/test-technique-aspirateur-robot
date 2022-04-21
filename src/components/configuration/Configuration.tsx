import React, {useMemo, useState} from "react";
import "./Configuration.scss"
import StepRoomSize from "./steps/roomSize/StepRoomSize";
import StepStart from "./steps/start/StepStart";
import StepVacuumLocation from "./steps/vacuumLocation/StepVacuumLocation";
import StepTest from "./steps/test/StepTest";
import NavBar from "./NavBar";

/**
 * Configuration steps
 */
export enum ConfigurationStep {
	Start = "step-start",
	RoomSize = "step-room-size",
	VacuumLocation = "step-vacuum-location",
	Test = "step-test"
}

/**
 * Vacuum orientation
 */
export enum VacuumOrientation {
	North = 0,
	East = 90,
	South = 180,
	West = 270,
}

/**
 * Vacuum configuration properties
 */
export interface IAutoVacuumConfiguration {
	roomLength: number,
	roomWidth: number,
	xLocation: number,
	yLocation: number,
	orientation: VacuumOrientation
}

/**
 * Steps order
 */
const stepsOrder = [
	ConfigurationStep.Start,
	ConfigurationStep.RoomSize,
	ConfigurationStep.VacuumLocation,
	ConfigurationStep.Test
]

/**
 * Default configuration
 */
const defaultConfiguration: IAutoVacuumConfiguration = {
	roomLength: 5, roomWidth: 5, xLocation: 0, yLocation: 0, orientation: 0
}

/**
 * Configuration
 */
export const Configuration = () => {
	const [_stepIndex, _setStepIndex] = useState<number>(0);
	const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IAutoVacuumConfiguration>(defaultConfiguration);

	/**
	 * Show next step
	 * @param vacuumConfiguration vacuum configuration in current step
	 */
	const showNextStep = (vacuumConfiguration: IAutoVacuumConfiguration) => () => {
		_setVacuumConfiguration({...vacuumConfiguration});
		_setStepIndex(_prevIndex => _prevIndex + 1);
	}

	/**
	 * Show previous step
	 * @param vacuumConfiguration vacuum configuration in current step
	 */
	const showPreviousStep = (vacuumConfiguration: IAutoVacuumConfiguration) => () => {
		_setVacuumConfiguration({...vacuumConfiguration});
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
					vacuumConfiguration={_vacuumConfiguration}
					showNextStep={showNextStep}/>
				<StepRoomSize
					step={ConfigurationStep.RoomSize}
					render={stepsOrder[_stepIndex] === ConfigurationStep.RoomSize}
					vacuumConfiguration={_vacuumConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
				<StepVacuumLocation
					step={ConfigurationStep.VacuumLocation}
					render={stepsOrder[_stepIndex] === ConfigurationStep.VacuumLocation}
					vacuumConfiguration={_vacuumConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
				<StepTest
					step={ConfigurationStep.Test}
					render={stepsOrder[_stepIndex] === ConfigurationStep.Test}
					vacuumConfiguration={_vacuumConfiguration}
					showPreviousStep={showPreviousStep}/>
			</div>
		)
	}, [_stepIndex]);
}