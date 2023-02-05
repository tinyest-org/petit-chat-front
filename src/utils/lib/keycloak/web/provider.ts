import { Context } from 'solid-js'
import { createAuthProvider, IAuthContextProps } from '../core'
import { reactKeycloakWebContext } from './context'

export const ReactKeycloakProvider = createAuthProvider(reactKeycloakWebContext as Context<IAuthContextProps<any>>)