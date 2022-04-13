import React, {useState} from "react";
import "./Configuration.css"
import RoomConfiguration from "./steps/RoomConfiguration";
import StartConfiguration from "./steps/StartConfiguration";

/**
 * Configuration steps
 */
export enum ConfigurationStep {
	Start = "step-start", GridSelection = "step-gridselection"
}

/**
 * Configuration
 */
export const Configuration = () => {
	const [stepsOrder] = useState([ConfigurationStep.Start, ConfigurationStep.GridSelection])
	const [stepIndex, setStepIndex] = useState<number>(0);

	const showNextStep = () => {
		setStepIndex(prevIndex => prevIndex + 1);
	}

	const showPreviousStep = () => {
		setStepIndex(prevIndex => prevIndex - 1);
	}

	return (
		<div className={"main-container " + stepsOrder[stepIndex]}>
			<StartConfiguration showNextStep={showNextStep}/>
			<RoomConfiguration showNextStep={showNextStep} showPreviousStep={showPreviousStep}/>
		</div>
	);
}