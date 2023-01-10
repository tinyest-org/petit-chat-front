import type {
    KeycloakConfig,
    KeycloakInitOptions,
} from '@absolid/solid-keycloak';

import Keycloak from "keycloak-js";


export const KEYCLOAK_CONFIG: KeycloakConfig = {
    realm: 'concord',
    url: process.env.REACT_APP_KEYCLOAK_ADDRESS || 'https://identity.tinyest.org',
    clientId: 'concord-front'
}
export const KEYCLOAK_INIT_OPTIONS: KeycloakInitOptions = {
    onLoad: 'login-required'
}

const keycloak = new Keycloak(KEYCLOAK_CONFIG);

export default keycloak;