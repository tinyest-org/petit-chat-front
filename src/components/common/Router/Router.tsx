import { Routes, Route } from "@solidjs/router"
import Layout from "../Layout/Layout"
import NewConv from "../../page/NewConv/NewConv"
import OneConv from "../../page/OneConv/OneConv"
import SearchMessages from "../../page/OneConv/SearchMessages"
import { UserProvider } from "../../../store/user/context"
import { createTheme, CssBaseline, ThemeProvider } from "@suid/material"
import LoginPage from "../../page/Login/Login"

const theme = createTheme({
    palette: {
        mode: 'dark',
    }
});

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