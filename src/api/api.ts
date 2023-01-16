import { HttpAPI } from './http/apiUtils';
import { httpApi } from './httpApi';
import { WebsocketConnection } from './ws/wsUtils';
import { getWs } from './wsApi';


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

    mountNotifications() {
        return this.wsAPI.ensureOpen()
            .then(() => this.hasWs = true);
    }
}


const api = new API(httpApi, getWs());

export {
    api, 
}