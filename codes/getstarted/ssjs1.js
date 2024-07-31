import React from 'react'
import { configureForReact, useStateStore, createStore, updateStore, getStore } from 'statestorejs'
configureForReact(React); // Configuration for using with react or react-natve

export default function SimpleCircuit(){
    createStore('storageName', 'storeId', {status: false, count: 0})
    return (
        <div>
            <Room id={1} />
            <Room id={2} />
            <SwitchButton />
            <FirstRoomOnStatus />
        </div>
    )
}

function SwitchButton(){
    const toggleSwitch = ()=>{
        const { status, count } = getStore('storageName', 'storeId')
        const reactors = !status?['status','count']: ['status'];
        updateStore(
            'storageName', 'storeId', 
            { actors: reactors, store:{ status, count:!status?count+1:count } }
        )
    }
    return <button onClick={toggleSwitch} > Switch </button>
}

function Room({id}){
    // Get current status and react to only changes in the 'status'
    const { status, count } = useStateStore('storageName', 'storeId', ['status'])
    // Turns off or on light in this room...
}

function FirstRoomOnStatus(){
    // Get number of times Room1 has been on and re-render only if it increases
    const { conut } = useStateStore('storageName', 'storeId', ['count'])
    // Displays how many times the first room is turned on...
}