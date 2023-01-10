/* @refresh reload */
import { render } from "solid-js/web";
import { KeycloakProvider } from '@absolid/solid-keycloak'
import keycloak, { keycloakConf, KEYCLOAK_INIT_OPTIONS } from "./keycloak";
import { Router } from "@solidjs/router"
import Routes from './components/common/Router/Router';
import { onMount } from "solid-js";

const Index = () => {

    onMount(() => {
        // keycloak.init(KEYCLOAK_INIT_OPTIONS);
    })

    return (
        <Router>
            <KeycloakProvider
                config={keycloakConf}
                initOptions={KEYCLOAK_INIT_OPTIONS}
            >
                <Routes />
            </KeycloakProvider>
        </Router>
    )
}

render(Index, document.getElementById("root")!);
