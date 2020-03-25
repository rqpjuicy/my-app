import React, { Component } from 'react'

import {Consumer} from "./Context"

import {pathToReg} from "path-to-regexp"

export default class Route extends Component {
    render() {
        return (
            <div>
              <Consumer>
                  {
                      (value)=>{
                          let {path,component:Component,exact=false}=this.props;
                          let pathname=value.location.pathname;

                          let keys=[];
                          let reg=pathToReg(path,keys,{end:exact});

                          keys.map(item=>{
                              item.name              
                          })
                          let result=pathname.match(reg);

                          let [url,...values]=result || [];

                          let props={
                              location:value.location,
                              history:value.history,
                              match:{
                                  params:keys.reduce((obj,current,index)=>{
                                    obj[current]=values;
                                    return obj;
                                  },{})
                          }
                        }
                          if(result){
                              return <Component {...props}></Component>
                          }
                          return null;


                      }
                  }
                  </Consumer>  
            </div>
        )
    }
}
