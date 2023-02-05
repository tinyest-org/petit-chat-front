import { Context, createSignal, JSX, onMount, useContext } from 'solid-js'
import { AuthedContext, AuthedProvider, IAuthContextProps, IntializedContext } from './context'
import {
    AuthClient,
    AuthClientError,
    AuthClientEvent,
    AuthClientInitOptions,
    AuthClientTokens,
} from './types'

/**
 * Props that can be passed to AuthProvider
 */
export type AuthProviderProps<T extends AuthClient> = {
    /**
     * The single AuthClient instance to be used by your application.
     */
    authClient: T

    /**
     * A flag to enable automatic token refresh. Defaults to true.
     * This is useful if you need to disable it (not recommended).
     *
     * @default true
     */
    autoRefreshToken?: boolean

    /**
     * The config to be used when initializing AuthClient instance.
     */
    initOptions?: AuthClientInitOptions

    /**
     * An optional loading check function to customize LoadingComponent display condition.
     * Return `true` to display LoadingComponent, `false` to hide it.
     *
     * @param authClient the current AuthClient instance.
     *
     * @returns {boolean} Set to true to display LoadingComponent, false to hide it.
     */
    isLoadingCheck?: (authClient: T) => boolean

    /**
     * An optional component to display while AuthClient instance is being initialized.
     */
    LoadingComponent?: JSX.Element

    /**
     * An optional function to receive AuthClient events as they happen.
     */
    onEvent?: (eventType: AuthClientEvent, error?: AuthClientError) => void

    /**
     * An optional function to receive AuthClient tokens when changed.
     *
     * @param {AuthClientTokens} tokens The current AuthClient tokens set.
     */
    onTokens?: (tokens: AuthClientTokens) => void
}

type AuthProviderState = {
    initialized: boolean

    isAuthenticated: boolean

    isLoading: boolean
}

/**
 * Create an AuthProvider component to wrap a React app with, it will take care of common AuthClient
 * lifecycle handling (such as initialization and token refresh).
 *
 * @param AuthContext the Auth context to be used by the created AuthProvider
 *
 * @returns the AuthProvider component
 */
export function createAuthProvider<T extends AuthClient>(
    AuthContext: Context<IAuthContextProps<T>>
) {
    const defaultInitOptions: AuthClientInitOptions = {
        onLoad: 'check-sso',
    }

    const initialState: AuthProviderState = {
        initialized: false,
        isAuthenticated: false,
        isLoading: true,
    }

    return function KeycloakProvider(props: AuthProviderProps<T> & { children: JSX.Element }) {
        // const [initialized, setInitialized] = createSignal(false);
        // const [isAuthenticated, setAuthed] = createSignal(false);
        const [state, setState] = createSignal({ ...initialState, authClient: props.authClient  });
        const { autoRefreshToken, authClient, onEvent, initOptions } = props;
        const value: IAuthContextProps<T> = [state, {}];
        const [authed, { set: setAuthed }] = useContext(AuthedContext)!;
        const [_, { set: setLogged }] = useContext(IntializedContext)!;
        onMount(() => {
            init();
        })

        // const componentDidUpdate = ({
        //     authClient: prevAuthClient,
        //     initOptions: prevInitOptions,
        // }: AuthProviderProps<T>) => {

        //     if (
        //         authClient !== prevAuthClient ||
        //         !isEqual(initOptions, prevInitOptions)
        //     ) {
        //         // De-init previous AuthClient instance
        //         prevAuthClient.onReady = undefined
        //         prevAuthClient.onAuthSuccess = undefined
        //         prevAuthClient.onAuthError = undefined
        //         prevAuthClient.onAuthRefreshSuccess = undefined
        //         prevAuthClient.onAuthRefreshError = undefined
        //         prevAuthClient.onAuthLogout = undefined
        //         prevAuthClient.onTokenExpired = undefined

        //         // Reset state
        //         setState({ ...initialState })
        //         // Init new AuthClient instance
        //         init()
        //     }
        // }

        const init = () => {
            // Attach Keycloak listeners
            authClient.onReady = updateState('onReady')
            authClient.onAuthSuccess = updateState('onAuthSuccess')
            authClient.onAuthError = onError('onAuthError')
            authClient.onAuthRefreshSuccess = updateState('onAuthRefreshSuccess')
            authClient.onAuthRefreshError = onError('onAuthRefreshError')
            authClient.onAuthLogout = updateState('onAuthLogout')
            authClient.onTokenExpired = refreshToken('onTokenExpired')

            console.log('using init');
            authClient
                .init({ ...defaultInitOptions, ...initOptions })
                .catch(onError('onInitError'))
        }

        const onError = (event: AuthClientEvent) => (error?: AuthClientError) => {
            const { onEvent } = props;
            // Notify Events listener
            onEvent && onEvent(event, error)
        }

        const updateState = (event: AuthClientEvent) => () => {
            const { authClient, onEvent, onTokens, isLoadingCheck } = props
            const {
                initialized: prevInitialized,
                isAuthenticated: prevAuthenticated,
                isLoading: prevLoading,
            } = state();
            console.log('updating state', state());
            // Notify Events listener
            onEvent && onEvent(event)

            // Check Loading state
            const isLoading = isLoadingCheck ? isLoadingCheck(authClient) : false

            // Check if user is authenticated
            const isAuthenticated = isUserAuthenticated(authClient)

            // Avoid double-refresh if state hasn't changed
            if (
                !prevInitialized ||
                isAuthenticated !== prevAuthenticated ||
                isLoading !== prevLoading
            ) {

                setState(old => ({
                    ...old,
                    isLoading,
                    initialized: true, 
                    isAuthenticated
                }));
                setAuthed(isAuthenticated);
                setLogged(true);
                // setInitialized(true);
                // setAuthed(isAuthenticated);
                console.log('is initialized');
            }

            // Notify token listener, if any
            const { idToken, refreshToken, token } = authClient
            onTokens &&
                onTokens({
                    idToken,
                    refreshToken,
                    token,
                })
        }

        const refreshToken = (event: AuthClientEvent) => async () => {

            // Notify Events listener
            onEvent && onEvent(event)

            if (autoRefreshToken !== false) {
                // Refresh Keycloak token
                authClient.updateToken(5);
            }
        }

        if (!!props.LoadingComponent && (!state().initialized || state().isLoading)) {
            return props.LoadingComponent;
        }


        return (
            <AuthContext.Provider value={value}>
                {props.children}
            </AuthContext.Provider>
        )
    }
}


function isUserAuthenticated(authClient: AuthClient) {
    return !!authClient.idToken && !!authClient.token
}

export default createAuthProvider