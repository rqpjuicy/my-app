import React from 'react'

import BrowserRouter from "./MyRouter"

//Route和Link的原理
import Route from './MyRoute'
import Link from './MyLink'
function Test(){
    return <h2>text</h2>
}

export default function AppRouter() {
    return (
        <BrowserRouter>
        <Link to="/index">首页</Link>
        {/* <Route path="/home" exact={false} component={Test}></Route> */}
        <Route path="/index" component={Test}></Route>
        </BrowserRouter>
    )
}
