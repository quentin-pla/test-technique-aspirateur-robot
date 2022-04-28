import {ArrowLeft, ArrowRight, DashCircle, PlusCircle} from "react-bootstrap-icons";
import Room from "../Room";
import {Button} from "react-bootstrap";
import React, {useMemo} from "react";
import {IUseRoomSize} from "./useRoomSize";
import {IRoomSizeProps} from "../RoomSize";
import {isOnMobile} from "../../../../../utils/utils";

interface IUseRoomSizeRendering {
    header: JSX.Element,
    room: JSX.Element,
    prevStepBtn: JSX.Element,
    nextStepBtn: JSX.Element
}

const useRoomSizeRendering = (props: IUseRoomSize & Pick<IRoomSizeProps, "showPreviousStep" | "showNextStep">): IUseRoomSizeRendering => {

    const renderHeader = useMemo(() => (
        <div className={"d-flex flex-column text-center mb-2 text-center"}>
            <h2>Configure your room</h2>
            {
                isOnMobile() ?
                    <p>Press <DashCircle size={15}/> or <PlusCircle size={15}/> to increase room
                        length and width</p>
                    :
                    <p>Long press <DashCircle size={15}/> or <PlusCircle size={15}/> to increase
                        quickly room length and width</p>
            }
        </div>
    ), [])

    const renderRoom = useMemo(() => (
        <Room
            gridRef={props.gridRef}
            cellSize={props.cellSize}
            vacuumConfiguration={props.vacuumConfiguration}
            handleIncreaseRoomWidth={props.handleIncreaseRoomWidth}
            handleIncreaseRoomLength={props.handleIncreaseRoomLength}
        />
    ), [props.cellSize, props.vacuumConfiguration])

    const renderPrevStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={props.showPreviousStep(props.vacuumConfiguration)}>
            <ArrowLeft size={30}/>
        </Button>
    ), [props.vacuumConfiguration])

    const renderNextStepBtn = useMemo(() => (
        <Button className={"move-step-btn"} onClick={props.showNextStep(props.vacuumConfiguration)}>
            <ArrowRight size={30}/>
        </Button>
    ), [props.vacuumConfiguration])

    return {
        room: renderRoom,
        header: renderHeader,
        nextStepBtn: renderNextStepBtn,
        prevStepBtn: renderPrevStepBtn
    }
}

export default useRoomSizeRendering;