import { useContext } from 'solid-js'
import { reactKeycloakWebContext } from './context'

export function useKeycloak() {
  const [ctx] = useContext(reactKeycloakWebContext)!;

  if (!ctx) {
    throw new Error(
      'useKeycloak hook must be used inside ReactKeycloakProvider context'
    )
  }

  if (!ctx().authClient) {
    throw new Error('authClient has not been assigned to ReactKeycloakProvider')
  }

  return ctx;
}