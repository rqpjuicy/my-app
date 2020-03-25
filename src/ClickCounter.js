import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';

class func extends Component{
    constructor(porps){
        super(props);
    }
    funcThree=function(){
            return '';
    }
    render(){
        return (
            <button onClick={this.funcThree}></button>
        )
    }
}
export default func;