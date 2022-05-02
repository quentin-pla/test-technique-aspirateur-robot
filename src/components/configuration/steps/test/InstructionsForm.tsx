import React, {useMemo} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {clearLongPress} from "../../../../utils/utils";
import {ArrowClockwise, ArrowCounterclockwise, ArrowUp, BackspaceFill, PlayFill, StopFill} from "react-bootstrap-icons";
import {IAutoVacuumConfiguration} from "../../hooks/useConfiguration";
import {VacuumInstruction} from "./hooks/useTest";

interface IInstructionsFormProps {
	vacuumConfiguration: IAutoVacuumConfiguration,
	instructions: Array<VacuumInstruction>,
	isAnimationInProgress: boolean,
	handleAddInstruction: (instruction: VacuumInstruction) => () => void,
	handleRemoveInstruction: () => void,
	handleExecuteInstructions: () => void,
	handleStopInstructionsExecution: () => void,
	maxInstructions: number,
}

const InstructionsForm = (props: IInstructionsFormProps) => {
	const {
		isAnimationInProgress,
		instructions,
		maxInstructions,
		vacuumConfiguration,
		handleAddInstruction,
		handleRemoveInstruction,
		handleExecuteInstructions,
		handleStopInstructionsExecution,
	} = props;

	const renderInstruction = (instruction: VacuumInstruction, index: number) => {
		switch (instruction) {
			case VacuumInstruction.GoFront:
				return <ArrowUp key={"instruction-go-front-" + index}/>;
			case VacuumInstruction.RotateLeft:
				return <ArrowCounterclockwise key={"instruction-rotate left-" + index}/>;
			case VacuumInstruction.RotateRight:
				return <ArrowClockwise key={"instruction-rotate-right-" + index}/>;
			default:
				throw new Error("Instruction '" + instruction + "' does not exist");
		}
	}

	return useMemo(() => {
		const areInstructionsButtonsDisabled = isAnimationInProgress || instructions.length >= maxInstructions;
		return (
			<Row className={"d-flex flex-column mt-3"}>
				<Col className={"col-12"}
					 onMouseUp={clearLongPress}>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-auto d-flex gap-2 mb-3"}>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
									onMouseDown={handleAddInstruction(VacuumInstruction.RotateLeft)}>
								<ArrowCounterclockwise/>
							</Button>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
									onMouseDown={handleAddInstruction(VacuumInstruction.GoFront)}>
								<ArrowUp/>
							</Button>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
									onMouseDown={handleAddInstruction(VacuumInstruction.RotateRight)}>
								<ArrowClockwise/>
							</Button>
						</Col>
						<Col className={"col-auto mb-3"}>
							<div className={"instructions-input"}>
								{instructions.map((instruction, index) => renderInstruction(instruction, index))}
								<div className={"back"} onMouseDown={handleRemoveInstruction}>
									{!isAnimationInProgress ? <BackspaceFill/> : null}
								</div>
							</div>
						</Col>
						<Col className={"col-auto d-flex justify-content-center align-items-center mb-3"}>
							{!isAnimationInProgress ?
								<Button
									className={"d-flex justify-content-center align-items-center gap-1 execution-btn "
										+ (instructions.length <= 0 ? "disabled" : "")}
									onClick={handleExecuteInstructions}>
									Start <PlayFill size={20}/>
								</Button>
								:
								<Button
									className={"d-flex justify-content-center align-items-center gap-1 execution-btn toggled"}
									onClick={handleStopInstructionsExecution}>
									Stop <StopFill size={20}/>
								</Button>
							}
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}, [vacuumConfiguration, instructions, isAnimationInProgress])
}

export default InstructionsForm;