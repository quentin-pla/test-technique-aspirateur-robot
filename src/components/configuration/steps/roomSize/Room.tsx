import React, {useMemo} from "react";
import {IAutoVacuumConfiguration} from "../../hooks/useConfiguration";
import useRoomRendering from "./hooks/useRoomRendering";

export interface IRoomProps {
    gridRef: React.RefObject<HTMLDivElement>,
    cellSize: number,
    vacuumConfiguration: IAutoVacuumConfiguration,
    handleIncreaseRoomWidth: (widthToAdd: number) => () => void,
    handleIncreaseRoomLength: (lengthToAdd: number) => () => void,
}

const Room = (props: IRoomProps) => {
    const rendering = useRoomRendering(props);

    return useMemo(() => {
        return (
            <div ref={props.gridRef} className={"room-grid"}>
                {rendering.widthButtons}
                <div className={"room-grid-delimiter"}>
                    {rendering.lengthButtons}
                    {rendering.roomLabel}
                    <div className={"room-grid-grow-div"} style={rendering.configuration.roomGrowDiv.style}/>
                </div>
            </div>
        )
    }, [rendering.configuration.roomGrowDiv.style])
}

export default Room;