import { createProvider, deleteStore, getStore, setStore, subscribe, unsubscribe, update } from "./global_store";

// Context providers are not accessible to outsiders
const provider = `private-${Math.random()}`;
createProvider(provider);

let ids = -99999999;
const unusedIds: string[] = [];

function getConetextId(){
    let id = unusedIds.pop();
    return id? id : `${ids++}`;
}

type Objects = {[k:string]: any}
export interface ContextId extends String{}
export interface ContextValue<V>{value: V}
type Context<O> = [ContextId, ContextValue<O>]

/**
 * Sets a store in a storage provider. A context is a store that is to be accessible to only the function that creates it and any other function 
 * that is called within. 
 * @param context The data to be stored
 * @example 
 * function Card(){
 *   const [contextId, context] = createContext({ amount: 20, name: 'john', age: 24 });
 *   console.log(context.value.amount)
 *   // Make context accessible to some other function
 *   SomeOtherFunction(contextId)
 *   // or probably pass it to a nested child component
 *  return (
 *      <div>  
 *          <Profile propsAccess={contextId} />
 *          <TransactionDetails propsAccess={contextId} />
 *      </div>
 *  )
 * }
 * 
 */
export function createContext<C=any>(context: C extends Objects?C:never): Context<C> {
    const id = getConetextId();
    setStore(provider, id, context)
    return [id,{value: context}]
}

/**
 * Clears a context.     
 * **Always clear contexts when not needed anymore.**
 * @param contextId Context identifier.
 * 
 */
export function destroyContext <S=any>(contextId: ContextId, context: ContextValue<S>){
    (context as any).value = {};
    !unusedIds.includes(contextId as string)&&unusedIds.push(contextId as string);
    deleteStore(provider, contextId as string);
}

/**
 * Subscribe to changes in a context or specific fields in the context object.     
 * **Make sure to `unsubscribeToContext` when nomore needed**
 * @param contextId  Context identifier.
 * @param data Update configuration object  
 * 
 */
export function subscribeToContext<S>(contextId: ContextId, data: {
    /**
     * An array of properties or fields in the store to attach a listener. 
     * If undefined, this listner shall be triggerered everytime the context is updated.  
     */
    watch?: Array<keyof S>;
    /** A listenr to be triggered when context is updated */
    action: (store: S)=>void;
}){
    return subscribe(provider, contextId as string, data)
}

/**
 * Unsubscribe to changes in a context. 
 * @param contextId Context identifier.
 * @param subscriptionId The subscription ID returned when `subscribeToContext` was called. 
 * 
 */
export const unsubscribeToContext = (contextId: ContextId, subscriptionId: string)=> unsubscribe(provider, contextId as any, subscriptionId);

/**
 * This function returns a copy of the context if no callback is provided.    
 * If a callback is provided, then it returns the value returned by the callback. If no such context exists in the storage provider,
 * null is returned.
 * @param contextId Context identifier. 
 * @param cb A callback that receives a copy of the context as argument if the context exists. This callback has no effect if context does not exist.     
 * 
 */
export function getContext<S , R=S, C = (((store: S) => R)|undefined)>(contextId: ContextId, cb?: C): C extends (store: S) => infer T ? T : S | null{
    return getStore(provider, contextId as any, cb)
}

type OptionalKeys<T> = {[K in keyof T]?: T[K]};


/**
 * Updates and trigger listners of a context.
 * @param contextId Context identifier.
 * @param context Provide the actual context to also update `context.value`. 
 * @param data Update configuration object.
 */
export function updateContext<S=any>(contextId: ContextId, context: S extends Objects?ContextValue<S>:never, data: {
   /**
     * An array of properties or fields whose listeners should respond to the changes. 
     * If undefined, updates and triggers all subscribed handlers. Set to an empty array `[]` to update without triggering subscribed handlers.    
     */
    actors?: Array<keyof S>;
    /** An object with the properties or fields to update. */
    context: OptionalKeys<S extends Objects ? S : never>;
}){
    // Updating requires the store prop is set
    (data as any).store = data.context;
    update(provider, contextId as any, data as any, context)
}


