import React, { useState } from 'react'

export default function SimpleCircuit(){
    const [status, setStatus] = useState(false);
    const [room1_OnCount, setRoom1_OnCount] = useState(0);
    const toggleSwitch = ()=>{
        setStatus(!status)
        setRoom1_OnCount(status?count:count+1)
    }
    return (
        <div>
            <Room id={1} status={status} />
            <Room id={2} status={!status} />
            <SwitchButton toggleSwitch={toggleSwitch} />
            <FirstRoomOnStatus count={room1_OnCount} />
        </div>
    )
}

function SwitchButton({toggleSwitch}){
    return <button onClick={toggleSwitch} > Switch </button>
}

function Room({id, status}){
    // Turns off or on light in this room...
}

function FirstRoomOnStatus({count}){
    // Displays how many times the first room is turned on...
}