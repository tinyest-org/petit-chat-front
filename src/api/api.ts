import keycloak from "../keycloak";
import { API, HTTPRequestError, QueryBodyPrepartor } from "./apiUtils";
import SimpleCache, { LocalStoreObjectDataStore } from "./utils/cacheUtils";
import { KeycloakSecurityProvider } from "./securityUtils";

export { HTTPRequestError };

const cacheKey = "CACHE"

const apiUrl = process.env.REACT_APP_API_URL || "/api";

const bodyPreparator = new QueryBodyPrepartor();

const cache = new SimpleCache(new LocalStoreObjectDataStore(cacheKey));
const securityProvider = new KeycloakSecurityProvider(keycloak);

export const api = new API(apiUrl, securityProvider, cache, bodyPreparator);

export const { get, put, del, patch, post } = api;



