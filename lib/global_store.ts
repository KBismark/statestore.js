
export const Store = new Map();

export const getPorvider = (provider: string)=>Store.get(provider);

export const createProvider = (provider: string)=> !getPorvider(provider)&&Store.set(provider, {});

const noop = ()=>{};

export const setStore = (provider: string, storeId: string, store: any)=>{
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

export function updateStore<S>(provider: string, storeId: string, data: {
    /** If undefined, updates and triggers all subscribed handlers. */
    actors?: Array<keyof S>;
    store: OptionalKeys<S extends {
        [k: string | number | symbol]: any;
    } ? S : never>;
}){
    update(provider,storeId,data)
}
export function update<S>(provider: string, storeId: string, data: {
    /** If undefined, updates and triggers all subscribed handlers. */
    actors?: Array<keyof S>;
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

export function subscribe<S>(provider: string, storeId: string, data: {
    watch?: Array<keyof S>;
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

export function unsubscribe<S>(provider: string, storeId: string, subscriptionId: string ){
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

export const getStoreId = (provider: string, storeId: string)=>{
    let branch = getPorvider(provider);
    if(!branch){
        return ''
    }
    if(!branch[storeId]){
        return '';
    }
    let id = branch[storeId].available.pop();
    if(!id){
        id = branch[storeId].listeners.length.actual++;
    }
    return id;
}



