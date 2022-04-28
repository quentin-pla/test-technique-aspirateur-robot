import React, {CSSProperties, useMemo} from "react";
import "../../assets/styles/Configuration.scss"
import RoomSize from "./steps/roomSize/RoomSize";
import Start from "./steps/start/Start";
import VacuumLocation from "./steps/vacuumLocation/VacuumLocation";
import Test from "./steps/test/Test";
import NavBar from "./navbar/NavBar";
import useConfiguration, {ConfigurationStep} from "./hooks/useConfiguration";

interface IConfigurationRenderConfig {
	navbar: {
		style: CSSProperties,
	}
	mainContainer: {
		style: CSSProperties
	}
}

export const Configuration = () => {
	const state = useConfiguration();

	const getRenderConfig = () => {
		const stepContainerWidth = 100 / state.stepsOrder.length;
		const config: IConfigurationRenderConfig = {
			navbar: {
				style: {
					width: stepContainerWidth + "%",
					transform: "translate(" + (100 * state.stepIndex) + "%)"
				},
			},
			mainContainer: {
				style: {
					width: (state.stepsOrder.length * 100) + "%",
					transform: "translate(-" + (stepContainerWidth * state.stepIndex) + "%)"
				}
			}
		}
		return config;
	}

	return useMemo(() => {
		const renderConfig = getRenderConfig();
		return (
			<div className={"main-container no-select"} style={renderConfig.mainContainer.style}>
				<NavBar step={state.stepsOrder[state.stepIndex]} style={renderConfig.navbar.style}/>
				<Start
					step={ConfigurationStep.Start}
					allowRendering={state.allowStartStepRendering}
					vacuumConfiguration={state.vacuumConfiguration}
					showNextStep={state.showNextStep}/>
				<RoomSize
					step={ConfigurationStep.RoomSize}
					allowRendering={state.allowRoomSizeStepRendering}
					vacuumConfiguration={state.vacuumConfiguration}
					showNextStep={state.showNextStep}
					showPreviousStep={state.showPreviousStep}/>
				<VacuumLocation
					step={ConfigurationStep.VacuumLocation}
					allowRendering={state.allowVacuumLocationStepRendering}
					vacuumConfiguration={state.vacuumConfiguration}
					showNextStep={state.showNextStep}
					showPreviousStep={state.showPreviousStep}/>
				<Test
					step={ConfigurationStep.Test}
					allowRendering={state.allowTestStepRendering}
					vacuumConfiguration={state.vacuumConfiguration}
					showPreviousStep={state.showPreviousStep}/>
			</div>
		)
	}, [state.stepIndex]);
}