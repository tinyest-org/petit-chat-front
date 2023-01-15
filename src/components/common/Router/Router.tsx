import { Routes, Route } from "@solidjs/router"
import Layout from "../../Layout/Layout"
import NewConv from "../../page/NewConv/NewConv"
import OneConv from "../../page/OneConv/OneConv"
import SearchMessages from "../../page/OneConv/SearchMessages"


export default function Router() {

    return (
        <Layout>
            <Routes>
                <Route path="/chat/:id" component={OneConv} />
                <Route path="/chat/:id/search" component={SearchMessages} />
                <Route path="/chat/new" component={NewConv} />
            </Routes>
        </Layout>
    )
}