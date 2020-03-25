import React, { Component } from 'react'
import {createBrowserHistory} from "history"

import {Provider} from './Context'

export default class BrowserRouter extends Component {
    constructor(props){
        super(props)
        this.history=createBrowserHistory();
        this.state={
            location:this.history.location

        }
    }
    this.unListen=this.history.listen(location=>{
        this.setState({
            location
        })
    })
    componentWillUnmount(){
        if(this.unListen){
            this.unListen();
        }
    }
    render() {
        let value={
            history:this.history,
            location:this.state.location
        }
        return (
            <Provider value={value}>
                   {this.props.children}
            </Provider>
        )
    }
}
