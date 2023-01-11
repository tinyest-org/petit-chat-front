import { HttpAPI } from './http/apiUtils';
import { httpApi } from './httpApi';


class API {
    private readonly httpAPI: HttpAPI;

    get http() {
        return this.httpAPI;
    }

    wsOpen = () => {
        return false;
    }

    constructor(
        httpAPI: HttpAPI,
        // TODO: SSE
        // TODO: WS
    ) {
        this.httpAPI = httpAPI;
    }
}


const api = new API(httpApi);

export {
    api, 
}