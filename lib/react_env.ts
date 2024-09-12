import { _ContextId, _createContext, _getContext, _subscribeToContext, _unsubscribeToContext } from "./context_store";
import { _getStore, _subscribe, _unsubscribe } from "./global_store";

const noop = (p?:any,d?:any):any=>{}
let R = {useState: noop, useMemo: noop, useEffect: noop, memo: noop}
export const _configureForReact = (react:any)=>{R = react};

export function _useStateContext<S>(contextId: _ContextId,watch?: Array<keyof S>) {
    const setState = R.useState({})[1];
    R.useEffect(()=>{
        if(watching){
            const subscriptionId = _subscribeToContext<S>(contextId, { watch, action:()=>setState({})});
            return ()=>_unsubscribeToContext(contextId,subscriptionId)
        }
    },[]);
    const watching = !watch || watch.length > 0;
    return _getContext<S>(contextId)
}

export function _useStateStore<S>(provider: string, storeId: string, watch?: Array<keyof S>) {
    const setState = R.useState({})[1];
    R.useEffect(()=>{
        if(watching){
            const subscriptionId = _subscribe<S>(provider, storeId, { watch, action:()=>setState({})});
            return ()=>_unsubscribe(provider, storeId, subscriptionId)
        }
    },[]);
    const watching = !watch || watch.length > 0;
    return _getStore<S>(provider, storeId)
}


export function _createComponent(Component:({propsSource}:{propsSource: string|_ContextId})=>any): ({propsSource}:{propsSource: string|_ContextId})=>any {
    return R.memo(Component)
}


