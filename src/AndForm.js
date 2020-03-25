import React, { Component } from 'react'

function AndFormCreate(Comp){
    return class extends Component{
        constructor(props){
            super(props);
            this.options={};
            this.state={};
        }
        handleChange=e=>{
            let {name,value}=e.target;
            this.setState({[name]:value},()=>{
                this.validateField();
            });
            
        }
        validateField=()=>{
            const rule=this.options[name].rule;
        }
        validateFields=()=>{
            //提交

        }
        getFieldDecorator=(field,options)=>{
            this.options[field]=options;
            return InputComp=>{
                return (
                    <div>
                        {
                            //虚拟dom对象，使其具有onChange事件
                            React.cloneElement(InputComp,{
                                name:field,
                                value:this.state[field] || '',
                                onChange:this.handleChange
                            })
                        }
                    </div>
                )
            }
        }
        render(){
            return <Comp {...this.props} getFieldDecorator={this.getFieldDecorator} validateFields={this.validateFields}/>
        }
    }
}

class AndForm extends Component {
    submitTest=()=>{
        this.props.validateFields();
    }
    render() {
        const {getFieldDecorator}=this.props;
        return (
            <div>
                <div> 
                    {getFieldDecorator("userName",{
                        rules:[{required:true,message:"Please input your username"}]
                    })(<input type="text"/>)}
                </div>
                <div>{getFieldDecorator("password",{
                        rules:[{required:true,message:"Please input your password"}]
                    })(<input type="password"/>)}</div>
                <div><button onClick={this.submitTest}>登录</button></div>
            </div>
        )
    }
}
const WidthForm=AndFormCreate(AndForm);
export default WidthForm;
