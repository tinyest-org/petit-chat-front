/* @refresh reload */
import { render } from "solid-js/web";
import keycloak, { keycloakConf } from "./keycloak";
import { Router } from "@solidjs/router"
import Routes from './components/common/Router/Router';
import { onMount } from "solid-js";
import { ReactKeycloakProvider } from "./utils/lib/keycloak/web";
import PreRouter from "./components/common/Router/PreRouter";
import { AuthedProvider, InitializedProvider } from "./utils/lib/keycloak/core";

const Index = () => {

    onMount(() => {
        // keycloak.init(KEYCLOAK_INIT_OPTIONS);
    })

    return (
        <Router>
            <InitializedProvider>
                <AuthedProvider>
                    <ReactKeycloakProvider
                        authClient={keycloak}
                    // initOptions={KEYCLOAK_INIT_OPTIONS}
                    >
                        <PreRouter />
                    </ReactKeycloakProvider>
                </AuthedProvider>
            </InitializedProvider>
        </Router>
    )
}

render(Index, document.getElementById("root")!);
