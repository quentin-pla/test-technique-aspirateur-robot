import React, {useEffect, useRef, useState} from "react";
import {IAutoVacuumConfiguration, VacuumOrientation} from "../../../hooks/useConfiguration";

export interface IUseVacuumLocation {
    grid: Array<Array<string>>,
    vacuumConfiguration: IAutoVacuumConfiguration,
    cellSize: number,
    vacuumRotation: number,
    allowTransitions: boolean,
    gridRef: React.RefObject<HTMLDivElement>,
    handleVacuumRotation: () => void,
    handleLocationSelection: (location: string) => () => void,
}

const useVacuumLocation = (props: {
    vacuumConfiguration: IAutoVacuumConfiguration,
    allowRendering: boolean,
}): IUseVacuumLocation => {
    const [_grid, _setGrid] = useState<Array<Array<string>>>(new Array<Array<string>>())
    const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IAutoVacuumConfiguration>(props.vacuumConfiguration);
    const [_cellSize, _setCellSize] = useState<number>(0);
    const [_vacuumRotation, _setVacuumRotation] = useState<number>(0);
    const [_allowTransitions, _setAllowTransitions] = useState<boolean>(false);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            const cellSize = getCellSize(props.vacuumConfiguration.roomLength, props.vacuumConfiguration.roomWidth);
            _setCellSize(cellSize);
        }
        if (props.allowRendering) {
            window.addEventListener('resize', handleResize);
            console.log("add")
        } else {
            window.removeEventListener('resize', handleResize);
            console.log("remove")
        }
    }, [props.allowRendering])

    useEffect(() => {
        if (!props.allowRendering) return;
        _setAllowTransitions(false);
        setTimeout(() => _setAllowTransitions(true), 300);
        const isXLocationOut = props.vacuumConfiguration.xLocation >= props.vacuumConfiguration.roomWidth;
        const isYLocationOut = props.vacuumConfiguration.yLocation >= props.vacuumConfiguration.roomLength;
        const config = {...props.vacuumConfiguration}
        if (isXLocationOut) config.xLocation = props.vacuumConfiguration.roomWidth - 1;
        if (isYLocationOut) config.yLocation = props.vacuumConfiguration.roomLength - 1;
        _setVacuumConfiguration(config);
    }, [props.allowRendering])

    useEffect(() => {
        // Do not update grid if size is the same
        if (_vacuumConfiguration.roomLength === _grid.length &&
            _vacuumConfiguration.roomWidth === _grid[0].length) return;
        const rows = Array.from(Array(_vacuumConfiguration.roomLength).keys());
        const columns = Array.from(Array(_vacuumConfiguration.roomWidth).keys());
        const grid = rows.map(row => columns.map(column => column + "," + row));
        const cellSize = getCellSize(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
        _setCellSize(cellSize);
        _setGrid(grid);
    }, [_vacuumConfiguration])

    const getCellSize = (rows: number, columns: number): number => {
        if (!gridRef.current) return 0;
        const gridHeight = gridRef.current.offsetHeight - 50;
        const gridWidth = gridRef.current.offsetWidth - 50;
        const cellHeight = gridHeight / rows;
        const cellWidth = gridWidth / columns;
        return cellWidth > cellHeight ? cellHeight : cellWidth;
    }

    const handleVacuumRotation = () => {
        _setVacuumRotation(prevAngle => prevAngle + 90);
        _setVacuumConfiguration(prevConfig => {
            let angle = prevConfig.orientation + 90;
            if (angle >= 360) angle = 0;
            let orientation: VacuumOrientation;
            switch (angle) {
                case 0:
                    orientation = VacuumOrientation.North;
                    break;
                case 90:
                    orientation = VacuumOrientation.East;
                    break;
                case 180:
                    orientation = VacuumOrientation.South;
                    break;
                case 270:
                    orientation = VacuumOrientation.West;
                    break;
                default:
                    throw new Error("Angle " + angle + "deg does not correspond to any orientation");
            }
            return {...prevConfig, orientation}
        });
    }

    const handleLocationSelection = (location: string) => () => {
        const [x, y] = location.split(",");
        const xLocation = parseInt(x);
        const yLocation = parseInt(y);
        _setVacuumConfiguration(prevConfig => {
            return {...prevConfig, xLocation, yLocation}
        });
    }

    return {
        grid: _grid,
        vacuumConfiguration: _vacuumConfiguration,
        cellSize: _cellSize,
        vacuumRotation: _vacuumRotation,
        allowTransitions: _allowTransitions,
        gridRef: gridRef,
        handleVacuumRotation: handleVacuumRotation,
        handleLocationSelection: handleLocationSelection
    }
}

export default useVacuumLocation;