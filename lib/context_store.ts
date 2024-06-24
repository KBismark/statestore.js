import { createProvider, getStore, setStore, subscribe, unsubscribe, update, updateStore } from "./global_store";

// Components context provider is not accessible to outsiders
const provider = `private-${Math.random()}`;
createProvider(provider);

let ids = -99999999;
const unusedIds: string[] = [];
function getConetextId(){
    let id = `${unusedIds.pop()}`;
    if(!id){
        id = `${ids++}`
    }
    return id;
}
type Objects = {[k:string]: any}
export interface ContextId extends String{}
export interface ContextValue<V>{value: V}
type Context<O> = [ContextId, ContextValue<O>]
export function createContext<C=any>(context: C extends Objects?C:never): Context<C> {
    const id = getConetextId();
    setStore(provider, id, context)
    return [id,{value: context}]
}

export function destroyContext(id: ContextId){

}

export function subscribeToContext<S>(contextId: ContextId, data: {
    watch?: Array<keyof S>;
    action: (store: S)=>void;
}){
    return subscribe(provider, contextId as string, data)
}

export const unsubscribeToContext = (contextId: ContextId, subscriptionId: string)=> unsubscribe(provider, contextId as any, subscriptionId);

export function getContext<S , R=S, C = (((store: S) => R)|undefined)>(contextId: ContextId, cb?: C): C extends (store: S) => infer T ? T : S | null{
    return getStore(provider, contextId as any, cb)
}

type OptionalKeys<T> = {[K in keyof T]?: T[K]};

export function updateContext<S=any>(contextId: ContextId, context: S extends Objects?ContextValue<S>:never, data: {
    /** If undefined, updates and triggers all subscribed handlers. */
    actors?: Array<keyof S>;
    context: OptionalKeys<S extends Objects ? S : never>;
}){
    // Updating requires the store prop is set
    (data as any).store = data.context;
    update(provider, contextId as any, data as any, context)
}



// const df = createContext({names: 4});
// destroyContext(df.contextId)


