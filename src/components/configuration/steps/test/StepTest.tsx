import React, {CSSProperties, useEffect, useMemo, useRef, useState} from "react";
import "./StepTest.scss";
import {Button, Col, Container, Image, Row, Toast, ToastContainer} from "react-bootstrap";
import {ArrowLeft, X} from "react-bootstrap-icons";
import {ConfigurationStep, IAutoVacuumConfiguration, VacuumOrientation} from "../../Configuration";
import {startLongPressTimeout} from "../../../../utils/utils";
import InstructionsForm from "./InstructionsForm";

/**
 * Vacuum instruction
 */
export enum VacuumInstruction {
	GoFront, RotateLeft, RotateRight
}

/**
 * Animation configuration
 */
interface IAnimationConfiguration {
	x: number,
	y: number,
	angle: number
}

/**
 * Execution result
 */
interface IExecutionResult {
	xLocation: number,
	yLocation: number,
	orientation: string
}

/**
 * Test configuration props
 */
interface ITestConfigurationProps {
	step: ConfigurationStep,
	render: boolean,
	showPreviousStep: (vacuumConfiguration: IAutoVacuumConfiguration) => () => void,
	vacuumConfiguration: IAutoVacuumConfiguration
}

// Animation interval
let animationInterval: NodeJS.Timer | null = null;

/**
 * Test configuration step
 */
const StepTest = (props: ITestConfigurationProps) => {
	const [_grid, _setGrid] = useState<Array<Array<string>>>(new Array<Array<string>>())
	const [_cellSize, _setCellSize] = useState<number>(0);
	const [_allowTransitions, _setAllowTransitions] = useState<boolean>(false);
	const [_instructions, _setInstructions] = useState<Array<VacuumInstruction>>(new Array<VacuumInstruction>());
	const [_maxInstructions] = useState<number>(30);
	const [_animationConfiguration, _setAnimationConfiguration] = useState<IAnimationConfiguration | null>(null);
	const [_executionResult, _setExecutionResult] = useState<IExecutionResult | null>(null);
	const [_showExecutionResult, _setShowExecutionResult] = useState<boolean>(false);
	const gridRef = useRef<HTMLDivElement>(null);

	/**
	 * On window resize
	 */
	useEffect(() => {
		const handleResize = () => {
			const cellSize = getCellSize(props.vacuumConfiguration.roomLength, props.vacuumConfiguration.roomWidth);
			_setCellSize(cellSize);
		}
		if (props.render) window.addEventListener('resize', handleResize);
		else window.removeEventListener('resize', handleResize);
	}, [props.render])

	/**
	 * On render
	 */
	useEffect(() => {
		if (!props.render) return;
		_setAllowTransitions(false);
		setTimeout(() => _setAllowTransitions(true), 300);
		const isSameGrid = props.vacuumConfiguration.roomLength === _grid.length &&
			props.vacuumConfiguration.roomWidth === _grid[0].length;
		if (isSameGrid) return;
		const rows = Array.from(Array(props.vacuumConfiguration.roomLength).keys());
		const columns = Array.from(Array(props.vacuumConfiguration.roomWidth).keys());
		const grid = rows.map(row => columns.map(column => row + "," + column));
		const cellSize = getCellSize(props.vacuumConfiguration.roomLength, props.vacuumConfiguration.roomWidth);
		_setCellSize(cellSize);
		_setGrid(grid);
	}, [props.render])

	/**
	 * On execution result has changed
	 */
	useEffect(() => {
		if (!!_executionResult) _setShowExecutionResult(true);
	}, [_executionResult])

	/**
	 * Get cell size
	 * @param rows number of rows
	 * @param columns number of columns
	 */
	const getCellSize = (rows: number, columns: number): number => {
		if (!gridRef.current) return 0;
		const gridHeight = gridRef.current.offsetHeight - 20;
		const gridWidth = gridRef.current.offsetWidth - 20;
		const cellHeight = gridHeight / rows;
		const cellWidth = gridWidth / columns;
		return cellWidth > cellHeight ? cellHeight : cellWidth;
	}

	/**
	 * On add instruction
	 */
	const onAddInstruction = (instruction: VacuumInstruction) => () => {
		const action = () => _setInstructions(prevInstructions => {
			if (prevInstructions.length === _maxInstructions) return prevInstructions;
			return [...prevInstructions, instruction];
		});
		startLongPressTimeout(action);
		action();
	}

	/**
	 * On remove instruction
	 */
	const onRemoveInstruction = () => {
		const action = () => _setInstructions(prevInstructions => {
			if (prevInstructions.length <= 0) return prevInstructions;
			const instructions = [...prevInstructions];
			instructions.length -= 1;
			return instructions;
		});
		startLongPressTimeout(action, 50);
		action();
	}

	/**
	 * On execute instructions
	 */
	const onExecuteInstructions = () => {
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

	/**
	 * On stop instructions execution
	 */
	const onStopInstructionsExecution = () => {
		_setAnimationConfiguration(null);
		if (!!animationInterval) clearInterval(animationInterval);
	}

	/**
	 * Animate instruction
	 * @param instruction
	 */
	const animateInstruction = (instruction: VacuumInstruction) => {
		_setAnimationConfiguration(prevConfig => {
			const animationConfiguration: IAnimationConfiguration = !!prevConfig ? {...prevConfig} : {
				x: props.vacuumConfiguration.xLocation,
				y: props.vacuumConfiguration.yLocation,
				angle: props.vacuumConfiguration.orientation
			}
			switch (instruction) {
				case VacuumInstruction.GoFront:
					const orientation = getOrientationFromAngle(animationConfiguration.angle);
					let x = animationConfiguration.x;
					let y = animationConfiguration.y;
					switch (orientation) {
						case VacuumOrientation.North:
							y += 1;
							if (y < props.vacuumConfiguration.roomLength) animationConfiguration.y = y;
							break;
						case VacuumOrientation.East:
							x += 1;
							if (x < props.vacuumConfiguration.roomWidth) animationConfiguration.x = x;
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

	/**
	 * Get orientation from angle
	 * @param angle angle in degrees
	 */
	const getOrientationFromAngle = (angle: number): VacuumOrientation => {
		const rest = angle % 360;
		if (rest === 0) return VacuumOrientation.North;
		else if (rest === 90 || rest === -270) return VacuumOrientation.East;
		else if (rest === 180 || rest === -180) return VacuumOrientation.South;
		else if (rest === 270 || rest === -90) return VacuumOrientation.West;
		return VacuumOrientation.North;
	}

	/**
	 * Get vacuum style properties
	 */
	const getVacuumStyle = (): CSSProperties => {
		if (!!_animationConfiguration) {
			return {
				bottom: (_animationConfiguration.y * _cellSize) + "px",
				left: (_animationConfiguration.x * _cellSize) + "px",
				transform: "rotate(" + _animationConfiguration.angle + "deg) scale(0.7)"
			};
		}
		return {
			bottom: (props.vacuumConfiguration.yLocation * _cellSize) + "px",
			left: (props.vacuumConfiguration.xLocation * _cellSize) + "px",
			transform: "rotate(" + props.vacuumConfiguration.orientation + "deg) scale(0.7)"
		};
	}

	/**
	 * On close execution result
	 */
	const onCloseExecutionResult = () => _setShowExecutionResult(false);

	/**
	 * Render grid
	 */
	const renderGrid = useMemo(() => {
		return _grid.map((row, rowIndex) => (
			<div key={"row-" + rowIndex} className={"room-grid-row"}>
				{row.map((column, columnIndex) => (
					<div key={"column-" + columnIndex} className={"room-grid-cell"}
					     style={{width: _cellSize + "px", height: _cellSize + "px"}}>
					</div>
				))}
			</div>
		))
	}, [_grid, _cellSize]);

	/**
	 * Render execution result
	 */
	const renderExecutionResult = useMemo(() => {
		return (
			<ToastContainer position={"bottom-end"}>
				<Toast show={_showExecutionResult} onClose={onCloseExecutionResult} delay={10000} autohide>
					<Toast.Body className={"d-flex flex-column"}>
						<div className={"d-flex justify-content-between"}>
							<span className={"toast-title"}>
								Execution has ended
							</span>
							<X className={"close"} size={25} onClick={onCloseExecutionResult}/>
						</div>
						{!!_executionResult ?
							<div className={"d-flex gap-2"}>
								<span>
									Position (X,Y): <strong>{_executionResult.xLocation + 1},{_executionResult.yLocation + 1}</strong>
								</span>
								<span>
									Orientation: <strong>{_executionResult.orientation}</strong>
								</span>
							</div>
							:
							null
						}
					</Toast.Body>
				</Toast>
			</ToastContainer>
		)
	}, [_showExecutionResult])

	return useMemo(() => {
		const goBackButton = (
			<Button className={"move-step-btn"} onClick={props.showPreviousStep(props.vacuumConfiguration)}>
				<ArrowLeft size={30}/>
			</Button>
		)
		return (
			<div id={props.step} className={"fullscreen-window " + (_allowTransitions ? "" : "no-transition")}>
				<Container fluid className={"h-100 pb-md-5"}>
					<Row className={"h-100"}>
						<Col className={"col-1 d-none d-md-flex align-items-center justify-content-center"}>
							{goBackButton}
						</Col>
						<Col className={"col-12 col-md-10 d-flex flex-column"}>
							<div className={"d-flex flex-column justify-content-center align-items-center text-center"}>
								<h2>Test your configuration</h2>
								<p>Select actions and click start to execute them</p>
								<InstructionsForm
									vacuumConfiguration={props.vacuumConfiguration}
									instructions={_instructions}
									isAnimationInProgress={!!_animationConfiguration}
									onRemoveInstruction={onRemoveInstruction}
									onAddInstruction={onAddInstruction}
									onStopInstructionsExecution={onStopInstructionsExecution}
									onExecuteInstructions={onExecuteInstructions}
									maxInstructions={_maxInstructions}
								/>
							</div>
							<div ref={gridRef} className={"room-grid"}>
								<div className={"room-grid-delimiter"}>
									{renderGrid}
									<div className={"autovacuum"} style={getVacuumStyle()}>
										<Image width={_cellSize + "px"} height={_cellSize + "px"}
										       src={"autovacuum.svg"}/>
									</div>
								</div>
							</div>
							<div className={"move-step-container"}>
								{goBackButton}
							</div>
						</Col>
						<Col className={"col-1 d-none d-md-flex"}/>
					</Row>
				</Container>
				{renderExecutionResult}
			</div>
		)
	}, [props.vacuumConfiguration, _grid, _allowTransitions, _instructions, _animationConfiguration, _showExecutionResult, _cellSize]);
}

export default StepTest;