import React, {useEffect, useRef, useState} from "react";
import {handleLongPress} from "../../../../../utils/utils";
import {IAutoVacuumConfiguration, VacuumOrientation} from "../../../hooks/useConfiguration";

export enum VacuumInstruction {
    GoFront, RotateLeft, RotateRight
}

export interface IAnimationConfiguration {
    x: number,
    y: number,
    angle: number
}

export interface IExecutionResult {
    xLocation: number,
    yLocation: number,
    orientation: string
}

interface IUseTestProps {
    vacuumConfiguration: IAutoVacuumConfiguration,
    allowRendering: boolean,
}

export interface IUseTest {
    grid: Array<Array<string>>,
    cellSize: number,
    allowTransitions: boolean,
    instructions: Array<VacuumInstruction>,
    maxInstructions: number,
    animationConfiguration: IAnimationConfiguration | null,
    executionResult: IExecutionResult | null,
    showExecutionResult: boolean,
    gridRef: React.RefObject<HTMLDivElement>,
    handleRemoveInstruction: () => void,
    handleAddInstruction: (instruction: VacuumInstruction) => () => void,
    handleStopInstructionsExecution: () => void,
    handleExecuteInstructions: () => void,
    handleCloseExecutionResult: () => void,
}

// Animation interval
let animationInterval: NodeJS.Timer | null = null;

const useTest = (props: IUseTestProps): IUseTest => {
    const {vacuumConfiguration, allowRendering} = props;
    const [_grid, _setGrid] = useState<IUseTest["grid"]>(() => new Array<Array<string>>())
    const [_cellSize, _setCellSize] = useState<IUseTest["cellSize"]>(0);
    const [_allowTransitions, _setAllowTransitions] = useState<IUseTest["allowTransitions"]>(false);
    const [_instructions, _setInstructions] = useState<IUseTest["instructions"]>(new Array<VacuumInstruction>());
    const [_maxInstructions] = useState<IUseTest["maxInstructions"]>(30);
    const [_animationConfiguration, _setAnimationConfiguration] = useState<IUseTest["animationConfiguration"]>(null);
    const [_executionResult, _setExecutionResult] = useState<IUseTest["executionResult"]>(null);
    const [_showExecutionResult, _setShowExecutionResult] = useState<IUseTest["showExecutionResult"]>(false);
    const gridRef: IUseTest["gridRef"] = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const cellSize = getCellSize(vacuumConfiguration.roomLength, vacuumConfiguration.roomWidth);
            _setCellSize(cellSize);
        }
        if (allowRendering) window.addEventListener('resize', handleResize);
        else window.removeEventListener('resize', handleResize);
    }, [allowRendering])

    useEffect(() => {
        refreshGrid();
    }, [allowRendering])

    useEffect(() => {
        if (!!_executionResult) _setShowExecutionResult(true);
    }, [_executionResult])

    const refreshGrid = () => {
        if (!allowRendering) return;
        _setAllowTransitions(false);
        setTimeout(() => _setAllowTransitions(true), 300);
        const isSameGrid = vacuumConfiguration.roomLength === _grid.length &&
            vacuumConfiguration.roomWidth === _grid[0].length;
        if (isSameGrid) return;
        const rows = Array.from(Array(vacuumConfiguration.roomLength).keys());
        const columns = Array.from(Array(vacuumConfiguration.roomWidth).keys());
        const grid = rows.map(row => columns.map(column => row + "," + column));
        const cellSize = getCellSize(vacuumConfiguration.roomLength, vacuumConfiguration.roomWidth);
        _setCellSize(cellSize);
        _setGrid(grid);
    }

    const getCellSize = (rows: number, columns: number): number => {
        if (!gridRef.current) return 0;
        const gridHeight = gridRef.current.offsetHeight - 20;
        const gridWidth = gridRef.current.offsetWidth - 20;
        const cellHeight = gridHeight / rows;
        const cellWidth = gridWidth / columns;
        return cellWidth > cellHeight ? cellHeight : cellWidth;
    }

    const animateInstruction = (instruction: VacuumInstruction) => {
        _setAnimationConfiguration(prevConfig => {
            const animationConfiguration: IAnimationConfiguration = !!prevConfig ? {...prevConfig} : {
                x: vacuumConfiguration.xLocation,
                y: vacuumConfiguration.yLocation,
                angle: vacuumConfiguration.orientation
            }
            switch (instruction) {
                case VacuumInstruction.GoFront:
                    const orientation = getOrientationFromAngle(animationConfiguration.angle);
                    let x = animationConfiguration.x;
                    let y = animationConfiguration.y;
                    switch (orientation) {
                        case VacuumOrientation.North:
                            y += 1;
                            if (y < vacuumConfiguration.roomLength) animationConfiguration.y = y;
                            break;
                        case VacuumOrientation.East:
                            x += 1;
                            if (x < vacuumConfiguration.roomWidth) animationConfiguration.x = x;
                            break;
                        case VacuumOrientation.South:
                            y -= 1;
                            if (y >= 0) animationConfiguration.y = y;
                            break;
                        case VacuumOrientation.West:
                            x -= 1;
                            if (x >= 0) animationConfiguration.x = x;
                            break;
                    }
                    break;
                case VacuumInstruction.RotateLeft:
                    animationConfiguration.angle -= 90;
                    break;
                case VacuumInstruction.RotateRight:
                    animationConfiguration.angle += 90;
                    break;

            }
            return animationConfiguration;
        })
    }

    const getOrientationFromAngle = (angle: number): VacuumOrientation => {
        const rest = angle % 360;
        if (rest === 0) return VacuumOrientation.North;
        else if (rest === 90 || rest === -270) return VacuumOrientation.East;
        else if (rest === 180 || rest === -180) return VacuumOrientation.South;
        else if (rest === 270 || rest === -90) return VacuumOrientation.West;
        return VacuumOrientation.North;
    }

    const handleAddInstruction: IUseTest["handleAddInstruction"] = (instruction: VacuumInstruction) => () => {
        const action = () => _setInstructions(prevInstructions => {
            if (prevInstructions.length === _maxInstructions) return prevInstructions;
            return [...prevInstructions, instruction];
        });
        handleLongPress(action);
        action();
    }

    const handleRemoveInstruction: IUseTest["handleRemoveInstruction"] = () => {
        const action = () => _setInstructions(prevInstructions => {
            if (prevInstructions.length <= 0) return prevInstructions;
            const instructions = [...prevInstructions];
            instructions.length -= 1;
            return instructions;
        });
        handleLongPress(action, 50);
        action();
    }

    const handleExecuteInstructions: IUseTest["handleExecuteInstructions"] = () => {
        if (_instructions.length === 0) return;
        _setShowExecutionResult(false);
        _setAnimationConfiguration(null);
        let instructionIndex = 0;
        animateInstruction(_instructions[instructionIndex]);
        ++instructionIndex;
        animationInterval = setInterval(() => {
            if (instructionIndex < _instructions.length) {
                animateInstruction(_instructions[instructionIndex]);
                ++instructionIndex;
            } else {
                if (!!animationInterval) clearInterval(animationInterval);
                setTimeout(() => _setAnimationConfiguration(prevConfig => {
                    if (!prevConfig) return null;
                    const orientation = getOrientationFromAngle(prevConfig.angle);
                    const orientationLabel = VacuumOrientation[orientation];
                    _setExecutionResult({
                        xLocation: prevConfig.x,
                        yLocation: prevConfig.y,
                        orientation: orientationLabel
                    });
                    return null;
                }), 1000);
            }
        }, 1000);
    }

    const handleStopInstructionsExecution: IUseTest["handleStopInstructionsExecution"] = () => {
        _setAnimationConfiguration(null);
        if (!!animationInterval) clearInterval(animationInterval);
    }

    const handleCloseExecutionResult: IUseTest["handleCloseExecutionResult"] = () => {
        _setShowExecutionResult(false);
    }

    return {
        gridRef: gridRef,
        grid: _grid,
        cellSize: _cellSize,
        allowTransitions: _allowTransitions,
        instructions: _instructions,
        maxInstructions: _maxInstructions,
        animationConfiguration: _animationConfiguration,
        executionResult: _executionResult,
        showExecutionResult: _showExecutionResult,
        handleRemoveInstruction: handleRemoveInstruction,
        handleAddInstruction: handleAddInstruction,
        handleStopInstructionsExecution: handleStopInstructionsExecution,
        handleExecuteInstructions: handleExecuteInstructions,
        handleCloseExecutionResult: handleCloseExecutionResult,
    }
}

export default useTest;