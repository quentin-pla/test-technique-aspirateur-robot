import React, {useMemo, useState} from "react";
import "./Configuration.css"
import RoomConfiguration from "./steps/RoomConfiguration";
import StartConfiguration from "./steps/StartConfiguration";
import HooverLocation from "./steps/HooverLocation";

/**
 * Configuration steps
 */
export enum ConfigurationStep {
	Start = "step-start", RoomConfiguration = "step-grid-selection", HooverLocation = "step-hoover-location"
}

/**
 * Hoover configuration properties
 */
export interface IHooverConfiguration {
	roomLength: number,
	roomWidth: number
}

/**
 * Steps order
 */
const stepsOrder = [
	ConfigurationStep.Start, ConfigurationStep.RoomConfiguration, ConfigurationStep.HooverLocation
]

/**
 * Configuration
 */
export const Configuration = () => {
	const [_stepIndex, _setStepIndex] = useState<number>(0);
	const [_hooverConfiguration, _setHooverConfiguration] = useState<IHooverConfiguration>({
		roomLength: 5, roomWidth: 5
	});

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
		return (
			<div className={"main-container"} style={{transform: transform, width: width}}>
				<StartConfiguration
					render={stepsOrder[_stepIndex] === ConfigurationStep.Start}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}/>
				<RoomConfiguration
					render={stepsOrder[_stepIndex] === ConfigurationStep.RoomConfiguration}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
				<HooverLocation
					render={stepsOrder[_stepIndex] === ConfigurationStep.HooverLocation}
					hooverConfiguration={_hooverConfiguration}
					showNextStep={showNextStep}
					showPreviousStep={showPreviousStep}/>
			</div>
		)
	}, [_stepIndex, _hooverConfiguration]);
}