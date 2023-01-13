import { SignalType } from "../../../../store/signal/type";
import { SignalProps } from "../messageItem";
import CallSignal from "./call";
import FileSignal from "./file";
import ImageSignal from "./image";
import { ArrivalSignal, LeftSignal } from "./move";
import TextSignal from "./text";



export type Renderer = (props: SignalProps) => any;


export const renderers: Record<SignalType, Renderer> = {
    [SignalType.TEXT]: TextSignal,
    [SignalType.FILE]: FileSignal,
    [SignalType.CALL]: CallSignal,
    [SignalType.ARRIVAL]: ArrivalSignal,
    [SignalType.LEFT]: LeftSignal,
    [SignalType.IMAGE]: ImageSignal,
}