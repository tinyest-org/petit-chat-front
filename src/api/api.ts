import keycloak from "../keycloak";
import { API, HTTPRequestError, QueryBodyPrepartor } from "./apiUtils";
import SimpleCache, { LocalStoreObjectDataStore } from "./utils/cacheUtils";
import { KeycloakSecurityProvider, NoopSecurityProvider } from "./securityUtils";

export { HTTPRequestError };

const cacheKey = "CACHE"

const apiUrl = 'http://localhost:8090'

const bodyPreparator = new QueryBodyPrepartor();

const cache = new SimpleCache(new LocalStoreObjectDataStore(cacheKey));
const securityProvider = new NoopSecurityProvider();

export const api = new API(apiUrl, securityProvider, cache, bodyPreparator);

export const { get, put, del, patch, post } = api;



