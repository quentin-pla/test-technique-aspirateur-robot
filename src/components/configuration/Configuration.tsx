import React, {useMemo, useState} from "react";
import "./Configuration.css"
import RoomConfiguration from "./steps/RoomConfiguration";
import StartConfiguration from "./steps/StartConfiguration";
import HooverLocation from "./steps/HooverLocation";

/**
 * Configuration steps
 */
export enum ConfigurationStep {
	Start = "step-start", GridSelection = "step-grid-selection", HooverLocation = "step-hoover-location"
}

/**
 * Steps order
 */
const stepsOrder = [
	ConfigurationStep.Start, ConfigurationStep.GridSelection, ConfigurationStep.HooverLocation
]

/**
 * Configuration
 */
export const Configuration = () => {
	const [_stepIndex, _setStepIndex] = useState<number>(0);

	/**
	 * Show next step
	 */
	const showNextStep = () => {
		_setStepIndex(_prevIndex => _prevIndex + 1);
	}

	/**
	 * Show previous step
	 */
	const showPreviousStep = () => {
		_setStepIndex(_prevIndex => _prevIndex - 1);
	}

	return useMemo(() => {
		const width = (stepsOrder.length * 100) + "%";
		const childWidth = 100 / stepsOrder.length;
		const transform = "translate(-" + (childWidth * _stepIndex) + "%)";
		return (
			<div className={"main-container"} style={{transform: transform, width: width}}>
				<StartConfiguration showNextStep={showNextStep}/>
				<RoomConfiguration showNextStep={showNextStep} showPreviousStep={showPreviousStep}/>
				<HooverLocation showNextStep={showNextStep} showPreviousStep={showPreviousStep}/>
			</div>
		)
	}, [_stepIndex]);
}