import { Navigate, useNavigate } from '@solidjs/router';
import { createEffect, Match, Suspense, Switch, useContext } from 'solid-js';
import { useAuthed, useInitiliazed } from '../../../utils/lib/keycloak/core';
import { useKeycloak } from '../../../utils/lib/keycloak/web';
import { reactKeycloakWebContext } from '../../../utils/lib/keycloak/web/context';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import LodingComponent from '../LoadingComponent/LoadingComponent';
import AppRouter from './Router';




export default function PreRouter() {
    // todo: clean this and go back to initial keycloak implem
    const [initialized] = useInitiliazed();
    const [authed] = useAuthed();

    return (
        <>
            <Switch>
                <Match when={!initialized()}>
                    <div>
                        <LoadingComponent
                            // style={{ height: "100vh" }}
                            loading />
                    </div>
                </Match>
                <Match when={!authed()}>
                    <Navigate href={"/"} />
                </Match>
                <Match when={initialized() && authed()}>
                    <AppRouter />
                </Match>
            </Switch>
        </>
    )

}