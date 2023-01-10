import { ID } from "../common/type"



export type RawSignal = {
    createdAt: ID;
    content: string;
    type: number;
    userId: ID;
}