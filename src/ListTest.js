import React from 'react'
import {Route,Link,Switch} from 'react-router-dom'

function ReactPage(){
    return <div>ReactPage</div>
}

function VuePage(){
    return <div>VuePage</div>
}
function NodePage(){
    return <div>NodePage</div>
}

export default function ListTest() {
    return (
        <div>
            <h2>ListTest</h2>
            <ul>
                <li>
                    <Link to="/list/react">react</Link>
                </li>
                <li>
                    <Link to="/list/vue">vue</Link>
                </li>
                <li>
                    <Link to="/list/node">node</Link>
                </li>
            </ul>
            <div>
            <Switch>
                <Route exact path="/list/react" component={ReactPage}></Route>
                <Route exact path="/list/vue" component={VuePage}></Route>
                <Route exact path="/list/node" component={NodePage}></Route>
            </Switch>
               
            </div>
        </div>
    )
}
