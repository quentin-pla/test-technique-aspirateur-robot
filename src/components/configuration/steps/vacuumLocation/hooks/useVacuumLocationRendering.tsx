import React, {CSSProperties, useMemo} from "react";
import {Button} from "react-bootstrap";
import {ArrowLeft, ArrowRight} from "react-bootstrap-icons";
import {IUseVacuumLocation} from "./useVacuumLocation";
import {IVacuumLocationProps} from "../VacuumLocation";


interface IUseVacuumLocationRenderingConfiguration {
    vacuumImage: {
        style: CSSProperties
    }
}

interface IUseVacuumLocationRendering {
    header: JSX.Element,
    grid: JSX.Element[],
    nextStepBtn: JSX.Element,
    previousStepBtn: JSX.Element,
    configuration: IUseVacuumLocationRenderingConfiguration
}

const useVacuumLocationRendering = (
    props: IUseVacuumLocation & Pick<IVacuumLocationProps, "showNextStep" | "showPreviousStep">
): IUseVacuumLocationRendering => {
    const {
        vacuumConfiguration,
        grid,
        cellSize,
        vacuumRotation,
        handleLocationSelection,
        showPreviousStep,
        showNextStep
    } = props;

    const renderHeader = useMemo(() => {
        return (
            <div
                className={"d-flex flex-column justify-content-center align-items-center mb-2 text-center "}>
                <h2>Place vacuum in the room</h2>
                <p>To place the vacuum, click on a cell</p>
                <p>Select the orientation by clicking on the vacuum</p>
            </div>
        )
    }, [])

    const renderGrid = useMemo(() => {
        return grid.reverse().map((row, rowIndex) => (
            <div key={"row-" + rowIndex} className={"room-grid-row"}>
                {row.map((column, columnIndex) => (
                    <div key={"column-" + columnIndex} className={"room-grid-cell"}
                         onClick={handleLocationSelection(row[columnIndex])}
                         style={{width: cellSize + "px", height: cellSize + "px"}}>
                    </div>
                ))}
            </div>
        ))
    }, [grid, cellSize]);

    const renderPreviousStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={showPreviousStep(vacuumConfiguration)}>
            <ArrowLeft size={30}/>
        </Button>
    ), [vacuumConfiguration])

    const renderNextStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={showNextStep(vacuumConfiguration)}>
            <ArrowRight size={30}/>
        </Button>
    ), [vacuumConfiguration])

    const getRenderConfig = (): IUseVacuumLocationRenderingConfiguration => {
        return {
            vacuumImage: {
                style: {
                    bottom: (vacuumConfiguration.yLocation * cellSize) + "px",
                    left: (vacuumConfiguration.xLocation * cellSize) + "px",
                    transform: "rotate(" + vacuumRotation + "deg) scale(0.7)"
                }
            }
        };
    }

    return {
        configuration: getRenderConfig(),
        grid: renderGrid,
        header: renderHeader,
        nextStepBtn: renderNextStepBtn,
        previousStepBtn: renderPreviousStepBtn
    }
}

export default useVacuumLocationRendering;