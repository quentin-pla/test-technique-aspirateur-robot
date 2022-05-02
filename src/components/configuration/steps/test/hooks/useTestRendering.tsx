import React, {CSSProperties, useMemo} from "react";
import {Button, Toast, ToastContainer} from "react-bootstrap";
import {ArrowLeft, X} from "react-bootstrap-icons";
import InstructionsForm from "../InstructionsForm";
import {IUseTest} from "./useTest";
import {ITestProps} from "../Test";

interface ITestRenderConfig {
    vacuumImage: {
        style: CSSProperties,
    }
}

interface IUseTestRendering {
    configuration: ITestRenderConfig,
    grid: JSX.Element[],
    executionResult: JSX.Element,
    previousStepBtn: JSX.Element,
    header: JSX.Element
}

const useTestRendering = (props: IUseTest & Pick<ITestProps, "showPreviousStep" | "vacuumConfiguration">): IUseTestRendering => {
    const {
        animationConfiguration,
        vacuumConfiguration,
        grid,
        cellSize,
        executionResult,
        showExecutionResult,
        instructions,
        maxInstructions,
        handleCloseExecutionResult,
        showPreviousStep,
        handleRemoveInstruction,
        handleAddInstruction,
        handleStopInstructionsExecution,
        handleExecuteInstructions,
    } = props;

    const getRenderConfig = (): ITestRenderConfig => {
        let vacuumImageStyle: CSSProperties;
        if (!!animationConfiguration) {
            vacuumImageStyle = {
                bottom: (animationConfiguration.y * cellSize) + "px",
                left: (animationConfiguration.x * cellSize) + "px",
                transform: "rotate(" + animationConfiguration.angle + "deg) scale(0.7)"
            };
        } else {
            vacuumImageStyle = {
                bottom: (vacuumConfiguration.yLocation * cellSize) + "px",
                left: (vacuumConfiguration.xLocation * cellSize) + "px",
                transform: "rotate(" + vacuumConfiguration.orientation + "deg) scale(0.7)"
            };
        }
        return {
            vacuumImage: {
                style: vacuumImageStyle
            }
        }
    }

    const renderGrid = useMemo(() => {
        return grid.map((row, rowIndex) => (
            <div key={"row-" + rowIndex} className={"room-grid-row"}>
                {row.map((column, columnIndex) => (
                    <div key={"column-" + columnIndex} className={"room-grid-cell"}
                         style={{width: cellSize + "px", height: cellSize + "px"}}>
                    </div>
                ))}
            </div>
        ))
    }, [grid, cellSize]);

    const renderExecutionResult = useMemo(() => {
        return (
            <ToastContainer position={"bottom-end"}>
                <Toast show={showExecutionResult} onClose={handleCloseExecutionResult} delay={10000}
                       autohide>
                    <Toast.Body className={"d-flex flex-column"}>
                        <div className={"d-flex justify-content-between"}>
							<span className={"toast-title"}>
								Execution has ended
							</span>
                            <X className={"close"} size={25} onClick={handleCloseExecutionResult}/>
                        </div>
                        {!!executionResult ?
                            <div className={"d-flex gap-2"}>
								<span>
									Position (X,Y): <strong>{executionResult.xLocation + 1},{executionResult.yLocation + 1}</strong>
								</span>
                                <span>
									Orientation: <strong>{executionResult.orientation}</strong>
								</span>
                            </div>
                            :
                            null
                        }
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        )
    }, [showExecutionResult])

    const renderPreviousStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={showPreviousStep(vacuumConfiguration)}>
            <ArrowLeft size={30}/>
        </Button>
    ), [vacuumConfiguration])

    const renderHeader = useMemo(() => (
        <div className={"d-flex flex-column justify-content-center align-items-center text-center"}>
            <h2>Test your configuration</h2>
            <p>Select actions and click start to execute them</p>
            <InstructionsForm
                vacuumConfiguration={vacuumConfiguration}
                instructions={instructions}
                isAnimationInProgress={!!animationConfiguration}
                handleRemoveInstruction={handleRemoveInstruction}
                handleAddInstruction={handleAddInstruction}
                handleStopInstructionsExecution={handleStopInstructionsExecution}
                handleExecuteInstructions={handleExecuteInstructions}
                maxInstructions={maxInstructions}
            />
        </div>
    ), [vacuumConfiguration, instructions, animationConfiguration])

    return {
        configuration: getRenderConfig(),
        grid: renderGrid,
        executionResult: renderExecutionResult,
        previousStepBtn: renderPreviousStepBtn,
        header: renderHeader,
    }
}

export default useTestRendering;