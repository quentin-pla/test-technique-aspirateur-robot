import React, {useEffect, useRef, useState} from "react";
import {IAutoVacuumConfiguration} from "../../../hooks/useConfiguration";
import {handleLongPress} from "../../../../../utils/utils";
import {IRoomSizeProps} from "../RoomSize";

export interface IUseRoomSize {
    cellSize: number,
    vacuumConfiguration: IAutoVacuumConfiguration,
    gridRef: React.RefObject<HTMLDivElement>,
    handleIncreaseRoomWidth: (widthToAdd: number) => () => void,
    handleIncreaseRoomLength: (lengthToAdd: number) => () => void,
}

const useRoomSize = (props: Pick<IRoomSizeProps, "vacuumConfiguration" | "allowRendering">): IUseRoomSize => {
    const {allowRendering, vacuumConfiguration} = props;
    const [_cellSize, _setCellSize] = useState<IUseRoomSize["cellSize"]>(0);
    const [_vacuumConfiguration, _setVacuumConfiguration] = useState<IUseRoomSize["vacuumConfiguration"]>(vacuumConfiguration);
    const gridRef: IUseRoomSize["gridRef"] = useRef<HTMLDivElement>(null);

    // Handle window resize only when component is allowed to be rendered
    useEffect(() => {
        const handleResize = () => {
            const cellSize = getOneMeterSizeInPixels(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
            _setCellSize(cellSize);
        }
        if (allowRendering) window.addEventListener('resize', handleResize);
        else window.removeEventListener('resize', handleResize);
    }, [allowRendering])

    // Update cell size on new vacuum configuration
    useEffect(() => {
        updateCellSize();
    }, [_vacuumConfiguration])

    // Retrieve vacuum configuration from previous step
    useEffect(() => {
        updateVacuumConfiguration();
    }, [allowRendering])

    const updateVacuumConfiguration = () => {
        if (allowRendering) _setVacuumConfiguration({...vacuumConfiguration});
    }

    const updateCellSize = () => {
        const cellSize = getOneMeterSizeInPixels(_vacuumConfiguration.roomLength, _vacuumConfiguration.roomWidth);
        _setCellSize(cellSize);
    }

    const increaseRoomLength = (currentLength: number, lengthToAdd: number): number => {
        let newValue = currentLength + lengthToAdd;
        if (newValue > 100) newValue = 100;
        else if (newValue < 1) newValue = 1;
        return newValue;
    }

    const increaseRoomWidth = (currentWidth: number, withToAdd: number): number => {
        let newValue = currentWidth + withToAdd;
        if (newValue > 100) newValue = 100;
        else if (newValue < 1) newValue = 1;
        return newValue;
    }

    const getOneMeterSizeInPixels = (length: number, width: number): number => {
        if (!gridRef.current) return 0;
        const gridHeight = gridRef.current.offsetHeight - 100;
        const gridWidth = gridRef.current.offsetWidth - 150;
        const cellHeight = gridHeight / length;
        const cellWidth = gridWidth / width;
        return cellWidth > cellHeight ? cellHeight : cellWidth;
    }

    const handleIncreaseRoomLength: IUseRoomSize["handleIncreaseRoomLength"] = (lengthToAdd: number) => () => {
        const action = () => _setVacuumConfiguration(prevConfiguration => ({
            ...prevConfiguration,
            roomLength: increaseRoomLength(prevConfiguration.roomLength, lengthToAdd)
        }));
        handleLongPress(action);
        action();
    }

    const handleIncreaseRoomWidth: IUseRoomSize["handleIncreaseRoomWidth"] = (widthToAdd: number) => () => {
        const action = () => _setVacuumConfiguration(prevConfiguration => ({
            ...prevConfiguration,
            roomWidth: increaseRoomWidth(prevConfiguration.roomWidth, widthToAdd)
        }));
        handleLongPress(action);
        action();
    }

    return {
        cellSize: _cellSize,
        vacuumConfiguration: _vacuumConfiguration,
        gridRef,
        handleIncreaseRoomWidth: handleIncreaseRoomWidth,
        handleIncreaseRoomLength: handleIncreaseRoomLength,
    }
}

export default useRoomSize;