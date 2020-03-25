import React, { Component } from 'react'

class Clock extends Component{
    state ={
        date:new Date(),
        counter:1
    }
    componentDidMount(){
        this.timer=setInterval(()=>{
            this.setState({date:new Date()},1000);
        });
        this.setState({counter:this.state.counter+1});
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    render(){
        return (
            <div>
                {this.state.date.toLocaleDateString()}
                <p>{this.state.counter}</p>
            </div>
        )
    }
}

export default class StateTest extends Component {
    render() {
        return (
            <div>
               <Clock/> 
            </div>
        )
    }
}
