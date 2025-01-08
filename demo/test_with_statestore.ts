/* This is a test with the usage of statestore.js to pass data from one function to the other */

import { createContext, createDerivedStore, createStore, createStoreHook, createStoreUpdater, getContext, getDerivedStore, getStore, subscribeToContext, subscribeToDerivedStore, updateContext, updateDerivedStore, updateStore, useDerivedStateStore, useStateStore } from "../lib";
import { _ContextId } from "../lib/context_store";

type UserInfo = { username: string, fulname: string}
type R = { town: string; user: UserInfo };

createStore<R>("p", "a", {
  town: "Kumasi",
  user: { username: "KBismark", fulname: "Bismark Yamoah" },
});
createDerivedStore<R>("p", "a", 'user');

function App(){
    const [contextId, context] = createContext({ username: 'KBismark', fulname: 'Bismark Yamoah'});

    //Simulates userinfo after 2 secods
    setTimeout(() => {
        // Change username
        updateContext(contextId, context, {actors: ['username'], context: {username: 'KBis'}});
        updateStore<R>("p", "a", {
          actors: ["user"],
          store: { user: { username: "Sister", fulname: "Bismark Yamoah" } },
        });
        setTimeout(() => {
            updateDerivedStore<R, 'user'>('p', 'a', 'user', {
                actors: ['fulname'],
                store: {fulname: 'Nana Adwoa'}
            })
        }, 1000);
    }, 2000);

    // Show current user info
    ShowUserInfo(contextId)
}

// Logs user info when user info is updated in the App method
function ShowUserInfo(propsAccess:  _ContextId){
    const actualProps = getContext<UserInfo>(propsAccess);
    SomeCPUIntensiveTask() // Performs some task
    console.log(actualProps);
    subscribeToDerivedStore<R, 'user'>('p', 'a', 'user', {
        watch: ['fulname'],
        action(store) {
            console.log(store, 'WORKED!');
            
        },
    })
    
    // Subscribe to changes in username only
    subscribeToContext<UserInfo>(propsAccess,{ watch: ['username'], action: (newProps)=>console.log(newProps)})
}

function SomeCPUIntensiveTask(){
    console.log('Performed some intensive task...');
}


// Start app
App();
