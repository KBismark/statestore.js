import { _ContextId, _createContext, _getContext, _subscribeToContext, _unsubscribeToContext } from "./context_store";
import { _getDerivedStore, _getStore, _subscribe, _subscribeToDerivedStore, _subscribeToStore, _unsubscribe, _unsubscribeToDerivedStore, _unsubscribeToStore } from "./global_store";

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
    const watching = !watch || watch.length > 0;
    R.useEffect(()=>{
        if(watching){
            const subscriptionId = _subscribeToStore<S>(provider, storeId, { watch, action:()=>setState({})});
            return ()=>_unsubscribeToStore(provider, storeId, subscriptionId)
        }
    },[watching]);
    
    return _getStore<S>(provider, storeId)
}

export function _useDerivedStore<S, K extends keyof S>(
  provider: string,
  storeId: string,
  fieldName: K,
  watch?: Array<keyof S[K]>
) {
  const setState = R.useState({})[1];
  const watching = !watch || watch.length > 0;
  R.useEffect(() => {
    if (watching) {
      const subscriptionId = _subscribeToDerivedStore<S, K>(provider, storeId, fieldName, {
        watch,
        action: () => setState({}),
      });
      return () => _unsubscribeToDerivedStore(provider, storeId, fieldName as string, subscriptionId);
    }
  }, [watching]);

  return _getDerivedStore<S, K>(provider, storeId, fieldName);
}


export function _createComponent(Component:({propsSource}:{propsSource: string|_ContextId})=>any): ({propsSource}:{propsSource: string|_ContextId})=>any {
    return R.memo(Component)
}


