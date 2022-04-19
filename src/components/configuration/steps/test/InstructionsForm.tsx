import React, {useMemo} from "react";
import {HooverInstruction} from "./StepTest";
import {Button, Col, Row} from "react-bootstrap";
import {resetLongPressTimeout} from "../../../../utils/utils";
import {ArrowClockwise, ArrowCounterclockwise, ArrowUp, BackspaceFill, PlayFill, StopFill} from "react-bootstrap-icons";
import {IHooverConfiguration} from "../../Configuration";

/**
 * Instructions form props
 */
interface IInstructionsFormProps {
	hooverConfiguration: IHooverConfiguration,
	instructions: Array<HooverInstruction>,
	isAnimationInProgress: boolean,
	onAddInstruction: (instruction: HooverInstruction) => () => void,
	onRemoveInstruction: () => void,
	onExecuteInstructions: () => void,
	onStopInstructionsExecution: () => void,
	maxInstructions: number,
}

/**
 * Instructions form
 */
const InstructionsForm = (props: IInstructionsFormProps) => {
	/**
	 * Render instruction
	 * @param instruction hoover instruction
	 * @param index instruction index
	 */
	const renderInstruction = (instruction: HooverInstruction, index: number) => {
		switch (instruction) {
			case HooverInstruction.GoFront:
				return <ArrowUp key={"instruction-go-front-" + index}/>;
			case HooverInstruction.RotateLeft:
				return <ArrowCounterclockwise key={"instruction-rotate left-" + index}/>;
			case HooverInstruction.RotateRight:
				return <ArrowClockwise key={"instruction-rotate-right-" + index}/>;
			default:
				throw new Error("Instruction '" + instruction + "' does not exist");
		}
	}

	return useMemo(() => {
		const areInstructionsButtonsDisabled = props.isAnimationInProgress || props.instructions.length >= props.maxInstructions;
		return (
			<Row className={"d-flex flex-column mt-3"}>
				<Col className={"col-12"}
				     onMouseUp={resetLongPressTimeout}>
					<Row className={"d-flex align-items-center justify-content-center"}>
						<Col className={"col-auto d-flex gap-2 mb-3"}>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
							        onMouseDown={props.onAddInstruction(HooverInstruction.RotateLeft)}>
								<ArrowCounterclockwise/>
							</Button>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
							        onMouseDown={props.onAddInstruction(HooverInstruction.GoFront)}>
								<ArrowUp/>
							</Button>
							<Button disabled={areInstructionsButtonsDisabled} className={"instruction-btn"}
							        onMouseDown={props.onAddInstruction(HooverInstruction.RotateRight)}>
								<ArrowClockwise/>
							</Button>
						</Col>
						<Col className={"col-auto mb-3"}>
							<div className={"instructions-input"}>
								{props.instructions.map((instruction, index) => renderInstruction(instruction, index))}
								<div className={"back"} onMouseDown={props.onRemoveInstruction}>
									{!props.isAnimationInProgress ? <BackspaceFill/> : null}
								</div>
							</div>
						</Col>
						<Col className={"col-auto d-flex justify-content-center align-items-center mb-3"}>
							{!props.isAnimationInProgress ?
								<Button
									className={"d-flex justify-content-center align-items-center gap-1 execution-btn "
										+ (props.instructions.length <= 0 ? "disabled" : "")}
									onClick={props.onExecuteInstructions}>
									Start <PlayFill size={20}/>
								</Button>
								:
								<Button
									className={"d-flex justify-content-center align-items-center gap-1 execution-btn toggled"}
									onClick={props.onStopInstructionsExecution}>
									Stop <StopFill size={20}/>
								</Button>
							}
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}, [props.hooverConfiguration, props.instructions, props.isAnimationInProgress])
}

export default InstructionsForm;