/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { KeycloakProvider } from '@absolid/solid-keycloak'
import { KEYCLOAK_CONFIG, KEYCLOAK_INIT_OPTIONS } from "./keycloak";


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
