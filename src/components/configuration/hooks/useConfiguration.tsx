import {useState} from "react";

export enum ConfigurationStep {
    Start = "step-start",
    RoomSize = "step-room-size",
    VacuumLocation = "step-vacuum-location",
    Test = "step-test"
}

export enum VacuumOrientation {
    North = 0,
    East = 90,
    South = 180,
    West = 270,
}

export interface IAutoVacuumConfiguration {
    roomLength: number,
    roomWidth: number,
    xLocation: number,
    yLocation: number,
    orientation: VacuumOrientation
}

interface IUseConfiguration {
    stepIndex: number,
    vacuumConfiguration: IAutoVacuumConfiguration,
    stepsOrder: Array<ConfigurationStep>,
    allowStartStepRendering: boolean,
    allowRoomSizeStepRendering: boolean,
    allowVacuumLocationStepRendering: boolean,
    allowTestStepRendering: boolean,
    showNextStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
    showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
}

const stepsOrder: IUseConfiguration["stepsOrder"] = [
    ConfigurationStep.Start,
    ConfigurationStep.RoomSize,
    ConfigurationStep.VacuumLocation,
    ConfigurationStep.Test
]

const defaultConfiguration: IAutoVacuumConfiguration = {
    roomLength: 5, roomWidth: 5, xLocation: 0, yLocation: 0, orientation: 0
}

const useConfiguration = (): IUseConfiguration => {
    const [_stepIndex, _setStepIndex] = useState<IUseConfiguration["stepIndex"]>(0);
    const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IUseConfiguration["vacuumConfiguration"]>(defaultConfiguration);

    const showNextStep: IUseConfiguration["showNextStep"] = (vacuumConfiguration: IAutoVacuumConfiguration) => () => {
        _setVacuumConfiguration({...vacuumConfiguration});
        _setStepIndex(_prevIndex => _prevIndex + 1);
    }

    const showPreviousStep: IUseConfiguration["showPreviousStep"] = (vacuumConfiguration: IAutoVacuumConfiguration) => () => {
        _setVacuumConfiguration({...vacuumConfiguration});
        _setStepIndex(_prevIndex => _prevIndex - 1);
    }

    return {
        stepIndex: _stepIndex,
        vacuumConfiguration: _vacuumConfiguration,
        stepsOrder: stepsOrder,
        allowStartStepRendering: stepsOrder[_stepIndex] === ConfigurationStep.Start,
        allowRoomSizeStepRendering: stepsOrder[_stepIndex] === ConfigurationStep.RoomSize,
        allowVacuumLocationStepRendering: stepsOrder[_stepIndex] === ConfigurationStep.VacuumLocation,
        allowTestStepRendering: stepsOrder[_stepIndex] === ConfigurationStep.Test,
        showNextStep: showNextStep,
        showPreviousStep: showPreviousStep,
    }
}

export default useConfiguration;