import { HttpAPI } from "../../http/apiUtils";



export class HttpBase {
    // base which should be used to generate Links
    // should look like the ws registrar
    protected api: HttpAPI;

    constructor(api: HttpAPI) { 
        this.api = api;
    }

    get register() {
        return {};
    }
}