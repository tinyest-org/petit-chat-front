import type {
    KeycloakConfig,
    KeycloakInitOptions,
} from '@absolid/solid-keycloak';

import Keycloak from "keycloak-js";


export const keycloakConf: KeycloakConfig = {
    realm: 'concord',
    url: 'https://identity.tinyest.org',
    clientId: 'concord-front'
}
export const KEYCLOAK_INIT_OPTIONS: KeycloakInitOptions = {
    onLoad: 'login-required'
}

const keycloak = new Keycloak(keycloakConf);

export default keycloak;