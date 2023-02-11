import { Route, Routes } from "@solidjs/router"
import { CssBaseline, ThemeProvider } from "@suid/material"
import { UserProvider } from "../../../store/user/context"
import { theme } from "../../../theme"
import NewConv from "../../page/NewConv/NewConv"
import OneConv from "../../page/OneConv/OneConv"
import SearchMessages from "../../page/OneConv/SearchMessages"
import Layout from "../Layout/Layout"


export default function Router() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
                <UserProvider>
                    <Routes>
                        <Route path="/chat/:id" component={OneConv} />
                        <Route path="/chat/:id/search" component={SearchMessages} />
                        <Route path="/chat/new" component={NewConv} />
                    </Routes>
                </UserProvider>
            </Layout>
        </ThemeProvider>
    )
}