import { KeycloakInstance } from "keycloak-js"
import { createContext } from "solid-js"
import { IAuthContextProps } from "../core"


export const reactKeycloakWebContext = createContext<IAuthContextProps<KeycloakInstance>>()

// export const ReactKeycloakWebContextConsumer = reactKeycloakWebContext.Consumer