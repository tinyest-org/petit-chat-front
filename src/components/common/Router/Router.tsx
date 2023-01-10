import { Routes, Route } from "@solidjs/router"
import NewConv from "../../page/NewConv/NewConv"
import OneConv from "../../page/OneConv/OneConv"


export default function Router() {



    return (
        <Routes>
            <Route path="/chat/:id" component={OneConv} />
            <Route path="/chat/new" component={NewConv} />
        </Routes>
    )
}