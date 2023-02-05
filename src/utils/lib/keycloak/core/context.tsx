import { Accessor, createContext, createSignal, JSX, useContext } from 'solid-js';
import { AuthClient } from './types';

/**
 * Auth Context props
 */
export type IAuthContextProps<T extends AuthClient> = [Accessor<{
  authClient: T;
  initialized: Accessor<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}>, {}]
// /**
//  * Create a React context containing an AuthClient instance.
//  *
//  * @param {IAuthContextProps} initialContext initial context value.
//  *
//  * @returns {React.Context} the ReactKeycloak context.
//  */
// export function createAuthContext<T extends AuthClient>(
//   initialContext?: Partial<IAuthContextProps<T>>
// ): Context<IAuthContextProps<T>> {
//   return createContext({
//     initialized: false,
//     ...initialContext,
//   })
// }

// export default createAuthContext




type AuthedContext = [Accessor<boolean>, {
  set(authed: boolean): void;
}];

export const AuthedContext = createContext<AuthedContext>();

export function AuthedProvider(props: { children: JSX.Element; }) {
  const [authed, setAuthed] = createSignal<boolean>(false);
  const store: AuthedContext = [
    authed,
    {
      set(authed: boolean) {
        setAuthed(authed);
      },
    }
  ];

  return (
    <AuthedContext.Provider value={store}>
      {props.children}
    </AuthedContext.Provider>
  );
}

export function useAuthed() {
  return useContext(AuthedContext)!;
}



type IntializedContext = [Accessor<boolean>, {
  set(authed: boolean): void;
}];

export const IntializedContext = createContext<IntializedContext>();

export function InitializedProvider(props: { children: JSX.Element; }) {
  const [inited, setAuthed] = createSignal<boolean>(false);
  const store: IntializedContext = [
    inited,
    {
      set(authed: boolean) {
        setAuthed(authed);
        console.log(inited());
      },
    }
  ];

  return (
    <IntializedContext.Provider value={store}>
      {props.children}
    </IntializedContext.Provider>
  );
}

export function useInitiliazed() {
  return useContext(IntializedContext)!;
}