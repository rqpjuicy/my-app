import React, { Component } from 'react'

import {Consumer} from "./Context"

export default class MyLink extends Component {
    handleClick=(e,history)=>{
        e.prevenDefault();
        history.push(this.props.to);
    }
    render() {
        const{to,...rest}=this.props;
        return (
            <Consumer>
                {
                    (value)=>{
                        return <a {...rest} onClick={e=>{
                            this.handleClick(e,value.history);
                        }} href="{to}">{this.props.children}</a>
                    }
                }</Consumer>
        )
    }
}
