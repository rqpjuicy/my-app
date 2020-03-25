import React, { Component ,Suspense,lazy } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import JsxTest from './JsxTest';
import Compotype from './Compotype';
import CartSample from './CartSample';
import HookTest from './HookTest';
// import WidthForm from './AndForm';
import ListTest from './ListTest';
import { BrowserRouter, HashRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
//import DetailTest from './DetailTest';

import BrowserRouter from './MyRouter'

const DetailTest = lazy(()=>import('./DetailTest'));


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <Button type="primary">Button</Button>
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

function Index() {
  return <div>首页</div>
}
function Nav() {
  return <div>菜单1</div>
}
function Test404() {
  return <div>404</div>
}
function Test(props) {
  return <div>
    {/* <Route render={(props)=>{
      
    }}>

    </Route> */}

  </div>
  return <div>{
    props.isLogin?
    Component:<Redirect to={{pathname:'/login'}}/>
  }</div>
}

function UpRoute({component:Component,isLogin,...res}){
  return <Route {...res} render={(props)=>{
    return isLogin?<Component {...props}></Component>:<Redirect to={{pathname:'/login'}}/>}}>

  </Route>
}

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <h1>react-router</h1>
          <ul>
            <li>
              <Link to="/">首页</Link>
            </li>
            <li>
              <Link to="/nav">菜单1</Link>
            </li>
            <li>
              <Link to="/list">列表</Link>
            </li>
            <li>
              <Link to="/detail/10001">详情</Link>
            </li>
            <li>
              <Link to="/test">守卫测试</Link>
            </li>
          </ul>
        </div>
        <div>
          <Switch>
            <Route exact path="/nav" component={Nav}></Route>
            <Route exact path="/" component={Index}></Route>
            <Route path="/list" component={ListTest}></Route> 
            {/* <Route path="/test" component={Test} render={
              props=><Test {...props} isLogin={true}></Test>
            }></Route>  */}
            <UpRoute path="/test" component={Test} isLogin={false}></UpRoute>
            <Route component={Test404}></Route> 
          </Switch>
          <Suspense fallback={<div>loading....</div>}>
            <Route path="/detail/:id" component={DetailTest}></Route>
          </Suspense>
          
        </div>
      </BrowserRouter>


    );
  }

}



