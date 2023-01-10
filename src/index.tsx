/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { KeycloakProvider } from '@absolid/solid-keycloak'
import { KEYCLOAK_CONFIG, KEYCLOAK_INIT_OPTIONS } from "./keycloak";
import { Router } from "@solidjs/router"

const Index = () => {

    return (
        <Router>
            <KeycloakProvider
                config={KEYCLOAK_CONFIG}
                initOptions={KEYCLOAK_INIT_OPTIONS}
            >
                <App />
            </KeycloakProvider>
        </Router>
    )
}

render(Index, document.getElementById("root")!);
