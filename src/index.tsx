/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import type {
    KeycloakConfig,
    KeycloakInitOptions,
} from '@absolid/solid-keycloak'
import { KeycloakProvider } from '@absolid/solid-keycloak'

const KEYCLOAK_CONFIG: KeycloakConfig = {
    realm: 'concord',
    url: 'https://identity.tinyest.org',
    clientId: 'concord-front'
}
const KEYCLOAK_INIT_OPTIONS: KeycloakInitOptions = {
    onLoad: 'login-required'
}

const Index = () => {

    return (
        <KeycloakProvider
            config={KEYCLOAK_CONFIG}
            initOptions={KEYCLOAK_INIT_OPTIONS}
        >
            <App />
        </KeycloakProvider>
    )
}

render(Index, document.getElementById("root")!);
