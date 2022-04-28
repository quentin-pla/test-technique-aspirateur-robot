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
    const getRenderConfig = (): ITestRenderConfig => {
        let vacuumImageStyle: CSSProperties;
        if (!!props.animationConfiguration) {
            vacuumImageStyle = {
                bottom: (props.animationConfiguration.y * props.cellSize) + "px",
                left: (props.animationConfiguration.x * props.cellSize) + "px",
                transform: "rotate(" + props.animationConfiguration.angle + "deg) scale(0.7)"
            };
        } else {
            vacuumImageStyle = {
                bottom: (props.vacuumConfiguration.yLocation * props.cellSize) + "px",
                left: (props.vacuumConfiguration.xLocation * props.cellSize) + "px",
                transform: "rotate(" + props.vacuumConfiguration.orientation + "deg) scale(0.7)"
            };
        }
        return {
            vacuumImage: {
                style: vacuumImageStyle
            }
        }
    }

    const renderGrid = useMemo(() => {
        return props.grid.map((row, rowIndex) => (
            <div key={"row-" + rowIndex} className={"room-grid-row"}>
                {row.map((column, columnIndex) => (
                    <div key={"column-" + columnIndex} className={"room-grid-cell"}
                         style={{width: props.cellSize + "px", height: props.cellSize + "px"}}>
                    </div>
                ))}
            </div>
        ))
    }, [props.grid, props.cellSize]);

    const renderExecutionResult = useMemo(() => {
        return (
            <ToastContainer position={"bottom-end"}>
                <Toast show={props.showExecutionResult} onClose={props.handleCloseExecutionResult} delay={10000}
                       autohide>
                    <Toast.Body className={"d-flex flex-column"}>
                        <div className={"d-flex justify-content-between"}>
							<span className={"toast-title"}>
								Execution has ended
							</span>
                            <X className={"close"} size={25} onClick={props.handleCloseExecutionResult}/>
                        </div>
                        {!!props.executionResult ?
                            <div className={"d-flex gap-2"}>
								<span>
									Position (X,Y): <strong>{props.executionResult.xLocation + 1},{props.executionResult.yLocation + 1}</strong>
								</span>
                                <span>
									Orientation: <strong>{props.executionResult.orientation}</strong>
								</span>
                            </div>
                            :
                            null
                        }
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        )
    }, [props.showExecutionResult])

    const renderPreviousStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={props.showPreviousStep(props.vacuumConfiguration)}>
            <ArrowLeft size={30}/>
        </Button>
    ), [props.vacuumConfiguration])

    const renderHeader = useMemo(() => (
        <div className={"d-flex flex-column justify-content-center align-items-center text-center"}>
            <h2>Test your configuration</h2>
            <p>Select actions and click start to execute them</p>
            <InstructionsForm
                vacuumConfiguration={props.vacuumConfiguration}
                instructions={props.instructions}
                isAnimationInProgress={!!props.animationConfiguration}
                handleRemoveInstruction={props.handleRemoveInstruction}
                handleAddInstruction={props.handleAddInstruction}
                handleStopInstructionsExecution={props.handleStopInstructionsExecution}
                handleExecuteInstructions={props.handleExecuteInstructions}
                maxInstructions={props.maxInstructions}
            />
        </div>
    ), [props.vacuumConfiguration, props.instructions, props.animationConfiguration])

    return {
        configuration: getRenderConfig(),
        grid: renderGrid,
        executionResult: renderExecutionResult,
        previousStepBtn: renderPreviousStepBtn,
        header: renderHeader,
    }
}

export default useTestRendering;