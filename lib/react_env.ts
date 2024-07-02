import { ContextId, createContext, getContext, subscribeToContext, unsubscribeToContext } from "./context_store";
import { getStore, subscribe, unsubscribe } from "./global_store";

const noop = (p?:any,d?:any):any=>{}
let R = {useState: noop, useMemo: noop, useEffect: noop, memo: noop}
export const configureForReact = (react:any)=>{R = react};

export function useStateContext<S>(contextId: ContextId,watch?: Array<keyof S>) {
    const setState = R.useState({})[1];
    R.useEffect(()=>{
        if(watching){
            const subscriptionId = subscribeToContext<S>(contextId, { watch, action:()=>setState({})});
            return ()=>unsubscribeToContext(contextId,subscriptionId)
        }
    },[]);
    const watching = !watch || watch.length > 0;
    return getContext<S>(contextId)
}

export function useStateStore<S>(provider: string, storeId: string, watch?: Array<keyof S>) {
    const setState = R.useState({})[1];
    R.useEffect(()=>{
        if(watching){
            const subscriptionId = subscribe<S>(provider, storeId, { watch, action:()=>setState({})});
            return ()=>unsubscribe(provider, storeId, subscriptionId)
        }
    },[]);
    const watching = !watch || watch.length > 0;
    return getStore<S>(provider, storeId)
}


export function createComponent(Component:({propsSource}:{propsSource: string|ContextId})=>any): ({propsSource}:{propsSource: string|ContextId})=>any {
    return R.memo(Component)
}


