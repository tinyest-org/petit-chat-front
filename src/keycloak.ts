import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";

const KEYCLOAK_TOKEN = "KEYCLOAK_TOKEN";

export const keycloakConf: KeycloakConfig = {
    realm: 'concord',
    url: 'https://identity.tinyest.org',
    clientId: 'concord-front'
}
// export const KEYCLOAK_INIT_OPTIONS: KeycloakInitOptions = {
//     onLoad: 'login-required'
// }

const keycloak = new Keycloak(keycloakConf);

export default keycloak;

// @ts-ignore
window[KEYCLOAK_TOKEN] = keycloak;

export const getKeycloak = () => {
    // @ts-ignore
    return window[KEYCLOAK_TOKEN];
}