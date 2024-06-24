/** Global State Storage */
const Store = new Map();

/**
 * Gets a set storage provider
 * @param provider A name for the storage provider
 * @returns 
 */
export const getPorvider = (provider: string)=>Store.get(provider);

/**
 * Creates a storage provider. A storage provider is a database for storing stateful data.
 * @param provider A name for the storage provider
 * @returns 
 */
export const createProvider = (provider: string)=> !getPorvider(provider)&&Store.set(provider, {});

// No performer
const noop = ()=>{};

/**
 * Sets a store in a storage provider
 * @param provider Storage provider's name
 * @param storeId Store identifier. A unique string that is used to access a store from a storage provider.
 * @param store The data to be stored
 */
export function setStore(provider: string, storeId: string, store: any){
    let branch = getPorvider(provider);
    if(!branch){
        Store.set(provider, branch = {})
    }
    if(!branch[storeId]){
        branch[storeId] = { value: store, listeners: {length: {action: noop, watch: [], actual: 0}}, available: [] };
    }
}

type OptionalKeys<T> = {
    [K in keyof T]?: T[K];
};
// type StoreGetter<S> = (<F = ((store: S) => any) | null>(deriver: F) => F extends (store: S) => infer R ? R | null : S | null);

/**
 * Gets a copy of a store's data from a storage provider. This function returns a copy of the store if no callback is provided.    
 * If a callback is provided, then it returns the value returned by the callback. If no such store exists in the storage provider,
 * null is returned.
 * @param provider Storage provider's name
 * @param storeId  Store identifier. A unique string that is used to access a store from a storage provider.
 * @param cb A callback that receives a copy of the store as argument if the store exists. This callback has no effect if store does not exist.     
 * 
 */
export function getStore<S , R=S, C = (((store: S) => R)|undefined)>(provider: string, storeId: string,cb?: C): C extends (store: S) => infer T ? T : S | null{
    let branch = getPorvider(provider);
    if(!branch){
        return null as any
    }
    const store = branch[storeId];
    if(!store){
        return null as any;
    }
    if(typeof cb === 'function'){
        return cb({...store.value})
    }
    return {...store.value};
}

/**
 * Updates and trigger listners of a store data.
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object
 * @param data.actors An array of properties or fields in the store whose listeners should respond to the changes.    
 * @param data.store An object with the properties or fields in the store to update. 
 */
export function updateStore<S>(provider: string, storeId: string, data: {
    /** If undefined, updates and triggers all subscribed handlers. */
    actors?: Array<keyof S>;
    store: OptionalKeys<S extends {
        [k: string | number | symbol]: any;
    } ? S : never>;
}){
    update(provider,storeId,data)
}

/**
 * Updates and trigger listners of a store data.
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object
 * @param ref An object. If provided, a copy of the store is set to the `ref.value`. It is not recommended to manually modify this value.    
 * 
 */
export function update<S>(provider: string, storeId: string, data: {
    /**
     * An array of properties or fields in the store whose listeners should respond to the changes. 
     * If undefined, updates and triggers all subscribed handlers. Set to empty array `[]` to update without triggering subscribed handlers.    
     */
    actors?: Array<keyof S>;
    /** An object with the properties or fields in the store to update. */
    store: OptionalKeys<S extends {
        [k: string | number | symbol]: any;
    } ? S : never>;
}, ref?: {value:S}){ 
    let branch = getPorvider(provider);
    if(!branch){
        return
    }
    const store = branch[storeId];
    if(!store){
        return;
    }
    let {actors, store: newUpdates} = data;

    if (!actors) {
        actors = [];
    }
    
    const subscribers = store.listeners;
    store.value = {...store.value,...newUpdates};
    if(ref) ref.value = store.value;
    const storeCopy = {...store.value};
    let subscription: {watch?: string[]; action: (store: any)=>void} = {watch: undefined} as any;
    let watch: string[]|undefined = undefined;
    for (let subscriberId in subscribers) {
        subscription = subscribers[subscriberId];
        if (subscription) {
            watch = subscription.watch;
            if (!watch) {
                // Trigger all listeners
                subscription.action(storeCopy);
            }
            else {
                // Trigger only those listeners set to respond to this changes
                for (let i = 0, l = actors.length; i < l; i++) {
                    if (watch.includes(actors[i] as string)) {
                        subscription.action(storeCopy);
                        break;
                    }
                }
            }
        }
    }
}

/**
 * Subscribe to changes in a store's data or specific fields in the store.     
 * *Make sure to `unsubscribe` when nomore needed.
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object  
 * 
 */
export function subscribe<S>(provider: string, storeId: string, data: {
    /**
     * An array of properties or fields in the store to attach a listener. 
     * If undefined, this listner shall be triggerered everytime there's a the store's data is updated.  
     */
    watch?: Array<keyof S>;
    /** A listenr to be triggered when store's data is updated */
    action: (store: S)=>void;
}){
    let branch = getPorvider(provider);
    if(!branch){
        return ''
    }
    const store = branch[storeId];
    if(!store){
        return '';
    }

    let subscriptionId: string = `${store.available.pop()}`;
    if(!subscriptionId){
        subscriptionId = `${store.listeners.length.actual++}`;
    }
    store.listeners[subscriptionId] = {watch: data.watch, action: data.action};
   return subscriptionId;
}

/**
 * Unsubscribe to changes in a store's data. 
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param subscriptionId The subscription ID returned when `subscribe` was called. 
 * 
 */
export function unsubscribe(provider: string, storeId: string, subscriptionId: string ){
    let branch = getPorvider(provider);
    if(!branch){
        return 
    }
    const store = branch[storeId];
    if(!store){
        return 
    }
    store.available.push(subscriptionId);
    store.listeners[subscriptionId] = undefined;
}





