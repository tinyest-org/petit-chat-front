import { API } from "../api";
import { NotificationHolder } from "../notification";



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


class Router {
    mapName(name: string): string {
        return '';
    }
}

class FunctionHandle<T> {
    api: API;
    canWs: boolean;
    name: string;
    notificationHolder: NotificationHolder<any>;
    router: Router;

    async queryHttp(): Promise<T> {
        return new Promise(() => {});
    }

    httpAsNotification() {
        const route = this.router.mapName(this.name);
        this.notificationHolder.pushNotification(route, );
    }

    query() {
        if (this.canWs) {
            // handle ws 
            return;
        }
    }

    apply() {

    }



}

const api = {
    chat: {
        postMessage: new FunctionHandle(),
    }
}

api.chat.postMessage.apply()