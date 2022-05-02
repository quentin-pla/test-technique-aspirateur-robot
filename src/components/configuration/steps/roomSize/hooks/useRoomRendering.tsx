import {Button} from "react-bootstrap";
import {DashCircleFill, PlusCircleFill} from "react-bootstrap-icons";
import React, {CSSProperties, useCallback, useMemo} from "react";
import {IRoomProps} from "../Room";

interface IUseRoomRenderConfig {
    roomGrowDiv: {
        style: CSSProperties
    }
}

interface IUseRoomRendering {
    configuration: IUseRoomRenderConfig,
    lengthButtons: JSX.Element,
    widthButtons: JSX.Element,
    roomLabel: JSX.Element
}

const useRoomRendering = (props: IRoomProps): IUseRoomRendering => {
    const {cellSize, vacuumConfiguration, handleIncreaseRoomLength, handleIncreaseRoomWidth} = props;

    const getRenderConfig = useCallback((): IUseRoomRenderConfig => {
        return {
            roomGrowDiv: {
                style: {
                    width: (cellSize * vacuumConfiguration.roomWidth) + "px",
                    height: (cellSize * vacuumConfiguration.roomLength) + "px"
                }
            }
        };
    }, [cellSize, vacuumConfiguration.roomLength, vacuumConfiguration.roomWidth])

    const renderLengthButtons = useMemo(() => (
        <div className={"room-grid-x-btn"}>
            <Button className={"btn-grid-size row-btn"}>
                <div
                    className={"d-flex flex-column justify-content-center align-items-center gap-3"}>
                    <PlusCircleFill
                        size={20}
                        className={"plus-btn"}
                        onMouseDown={handleIncreaseRoomLength(1)}
                    />
                    {vacuumConfiguration.roomLength}m
                    <DashCircleFill
                        size={20}
                        className={"minus-btn"}
                        onMouseDown={handleIncreaseRoomLength(-1)}
                    />
                </div>
            </Button>
        </div>
    ), [vacuumConfiguration])

    const renderWidthButtons = useMemo(() => (
        <div className={"room-grid-y-btn"}>
            <Button className={"btn-grid-size"}>
                <div className={"d-flex justify-content-center align-items-center gap-3"}>
                    <DashCircleFill
                        size={20}
                        className={"minus-btn"}
                        onMouseDown={handleIncreaseRoomWidth(-1)}
                    />
                    {vacuumConfiguration.roomWidth}m
                    <PlusCircleFill
                        size={20}
                        className={"plus-btn"}
                        onMouseDown={handleIncreaseRoomWidth(1)}
                    />
                </div>
            </Button>
        </div>
    ), [vacuumConfiguration])

    const renderRoomLabel = useMemo(() => (
        <div className={"fill-absolute overflow-hidden"}>
            <div className={"room-grid-center-label"}>
                My room
            </div>
        </div>
    ), [])

    return {
        configuration: getRenderConfig(),
        lengthButtons: renderLengthButtons,
        roomLabel: renderRoomLabel,
        widthButtons: renderWidthButtons,
    }
}

export default useRoomRendering;