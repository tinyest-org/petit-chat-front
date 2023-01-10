import type {
    KeycloakConfig,
    KeycloakInitOptions,
} from '@absolid/solid-keycloak'
import { KeycloakProvider } from '@absolid/solid-keycloak'

export const KEYCLOAK_CONFIG: KeycloakConfig = {
    realm: 'concord',
    url: 'https://identity.tinyest.org',
    clientId: 'concord-front'
}
export const KEYCLOAK_INIT_OPTIONS: KeycloakInitOptions = {
    onLoad: 'login-required'
}