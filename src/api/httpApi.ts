import keycloak from "../keycloak";
import { HttpAPI, HTTPRequestError } from "./http/apiUtils";
import SimpleCache, { LocalStoreObjectDataStore } from "./http/utils/cacheUtils";
import { KeycloakSecurityProvider, NoopSecurityProvider } from "./http/securityUtils";
import { QueryBodyPreparator } from "./http/serialyzer";

export { HTTPRequestError };

const cacheKey = "CACHE"

const devDefaultConf = {
    apiUrl: "http://localhost:8090",
}

const apiUrl = import.meta.env.VITE_API_URL || devDefaultConf.apiUrl;


const bodyPreparator = new QueryBodyPreparator();

const cacheDatastore = new LocalStoreObjectDataStore(cacheKey);
const cache = new SimpleCache(cacheDatastore);

const securityProvider = new NoopSecurityProvider();

export const httpApi = new HttpAPI(apiUrl, securityProvider, cache, bodyPreparator);


