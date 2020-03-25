import React, { Component } from 'react'
import logo from './logo.svg'
import './JsxTest.css'

function formatName(user){
    return user.firstName+'-'+user.lastName;
}
export default class JsxTest extends Component {
    render() {
        const name='Jerry';
        const greet=<p>hello,Jerry!</p>
        return (
            <div>
                <h1>{name}</h1>
                <p>{formatName({firstName:"tom",lastName:"cruis"})}</p>
                {greet}
                <img src={logo} style={{width:"100px"}} alt="logo"/>
                <label htmlFor="ff">ff</label>
            </div>
        )
    }
}
