/* This is a test with the usage of statestore.js to pass data from one function to the other */

import { createContext, getContext, subscribeToContext, updateContext } from "../lib";
import { ContextId } from "../lib/context_store";

type UserInfo = { username: string, fulname: string}
function App(){
    const [contextId, context] = createContext({ username: 'KBismark', fulname: 'Bismark Yamoah'});

    //Simulates userinfo after 2 secods
    setTimeout(() => {
        // Change username
        updateContext(contextId, context, {actors: ['username'], context: {username: 'KBis'}})
    }, 2000);

    // Show current user info
    ShowUserInfo(contextId)
}


// Logs user info when user info is updated in the App method
function ShowUserInfo(propsAccess:  ContextId){
    const actualProps = getContext<UserInfo>(propsAccess);
    SomeCPUIntensiveTask() // Performs some task
    console.log(actualProps);
    
    // Subscribe to changes in username only
    subscribeToContext<UserInfo>(propsAccess,{ watch: ['username'], action: (newProps)=>console.log(newProps)})
}

function SomeCPUIntensiveTask(){
    console.log('Performed some intensive task...');
}


// Start app
App();
