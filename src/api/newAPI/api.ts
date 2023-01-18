import { API } from "../api";



export type Convertor<F, T> = (from: F) => T; 


/**
 * Définition d'une pipeline
 * => tout est async
 * 
 * 
 * 
 * 
 */

name => FunctionHandle {
    name
    encoder
    decoder
}



/**
api => funcName => mapArgs => chooseLink => encode => send
injectResponse as a notification
 */


class FunctionHandle {
    api: API;
}