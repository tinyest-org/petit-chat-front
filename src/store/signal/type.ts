import { ID } from "../common/type"



export type RawSignal = {
    uuid: ID;
    createdAt: ID;
    content: string;
    type: keyof typeof mapping;
    userId: ID;
}

export enum SignalType {
    TEXT = 0,
    FILE = 1,
    CALL = 2,
    ARRIVAL = 3,
    LEFT = 4,
    IMAGE = 5,
}

const mapping = {
    0: SignalType.TEXT,
    1: SignalType.FILE,
    2: SignalType.CALL,
    3: SignalType.ARRIVAL,
    4: SignalType.LEFT,
    5: SignalType.IMAGE,
}

export function mapSignalType(type: keyof typeof mapping): SignalType {
    return mapping[type];
}