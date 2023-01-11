import keycloak from "../keycloak";
import { API, HTTPRequestError } from "./apiUtils";
import SimpleCache, { LocalStoreObjectDataStore } from "./utils/cacheUtils";
import { KeycloakSecurityProvider, NoopSecurityProvider } from "./securityUtils";
import { QueryBodyPreparator } from "./serialyzer";

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

export const api = new API(apiUrl, securityProvider, cache, bodyPreparator);

export const { get, put, del, patch, post } = api;



