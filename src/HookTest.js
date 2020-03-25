import React, { Component, useState ,useContext, useReducer} from 'react'


const Context = React.createContext();
const { Provider } = Context;


function FruitAdd(props) {
    const context = useContext(Context);
    const {fruits,dispatch}=context;
    const [fname, setPname] = useState('');

    const onAddFruit = e => {
        if (e.key == 'Enter') {
            // setFruits([...fruits, fname])
            dispatch({type:"add",newF:fname});
            setPname("");
        }
    }
    return (
        <div>
            <input type="text" value={fname} onChange={e => setPname(e.target.value)} onKeyDown={onAddFruit} />
        </div>
    )
}

function FruitList({ fruits, setFruit }) {
    return (<ul>
        {fruits.map((item, index) => <li key={index} onClick={() => { setFruit(item) }}>{item}</li>)}
    </ul>
    );
}

function FruitReducer(state,action){
    switch (action.type){
        case "init":return ""
        case "add":return [...state,action.newF];
        default:return state;
    }
}

export default function HookTest() {
    const [fruit, setFruit] = useState('草莓');
    //const [fruits, setFruits] = useState(['草莓', '香蕉']);
    const [fruits, dispatch] = useReducer(FruitReducer,['草莓', '香蕉']);
    return (
        //     <>
        //        <Provider value={{ fruits, setFruits }}>
        //            <p>
        //                {fruit === '' ? '请选择喜欢的水果' : `您选择的是${fruit}`}
        //            </p>
        //            <FruitAdd />
        //            <FruitList fruits={fruits} setFruit={setFruit} />
        //        </Provider>
        //    </>
        <>
            <Provider value={{fruits,dispatch}}>
                <div>{fruit == '' ? '请选择你喜欢的水果' : `你选择的水果是${fruit}`}</div>
                <FruitAdd />
                <FruitList fruits={fruits} setFruit={setFruit} />
            </Provider>
        </>
    )
}



