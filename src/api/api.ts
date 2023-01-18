import { HttpAPI } from './http/apiUtils';
import { httpApi } from './httpApi';
import { WebsocketConnection } from './ws/wsUtils';
import { getWs, ws } from './wsApi';



interface APIHandle<P extends (...args: any) => any, T> {
    http(...params: Parameters<P>): Promise<T>;
    ws(...params: Parameters<P>): void;
}


const handle: APIHandle<(e: string) => void, void> = {
    http: (e: string) => {
        return new Promise<void>(() => { });
    },
    ws: (e: string) => null,
}

export class API {
    private readonly httpAPI: HttpAPI;
    private readonly wsAPI: WebsocketConnection;
    private hasWs = false;

    get http() {
        return this.httpAPI;
    }

    get ws() {
        return this.wsAPI;
    }

    wsOpen = () => {
        return this.hasWs;
    }

    constructor(
        httpAPI: HttpAPI,
        wsAPI: WebsocketConnection,
        // TODO: SSE
        // TODO: WS
    ) {
        this.httpAPI = httpAPI;
        this.wsAPI = wsAPI;
    }

    public mountNotifications = () => {
        return this.wsAPI.ensureOpen()
            .then(() => {
                this.hasWs = true;
                // TODO: detect closing
            });
    }
}


const api = new API(httpApi, getWs());

export {
    api,
}