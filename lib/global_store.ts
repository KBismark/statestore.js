/** Global State Storage */
const Store = new Map();

const DerivedStore = new Map();

/**
 * Gets a set storage provider
 * @param provider A name for the storage provider
 * @returns 
 */
export const getProvider = (provider: string)=>Store.get(provider);

/**
 * Creates a storage provider. A storage provider is a database for storing stateful data.
 * @param provider A name for the storage provider
 * 
 */
export const createProvider = (provider: string)=> !getProvider(provider)&&Store.set(provider, {});

// No performer
const noop = ()=>{};

/**
 * Clears a storage provider
 * @param provider A name for the storage provider
 * 
 */
export function _deleteProvider(provider: string){
    Store.delete(provider)
}

/**
 * Removes a store from a storage provider
 * @param provider A name for the storage provider
 * @param storeId Store identifier.
 * 
 */
export function _deleteStore(provider: string, storeId: string){
    let branch = getProvider(provider);
    if(!branch){
        return;
    }
    const store = branch[storeId];
    if (!store) return;
    Object.keys(store.value||{}).forEach((fieldName)=>{
        const providerName = `${provider}/${storeId}/${String(
          fieldName
        )}`;
        DerivedStore.delete(providerName);
    });
    branch[storeId] = store.value = undefined;
}

/**
 * Sets a store in a storage provider
 * @param provider Storage provider's name
 * @param storeId Store identifier. A unique string that is used to access a store from a storage provider.
 * @param store The data to be stored
 */
export function _createStore<S=any>(provider: string, storeId: string, store: S extends Objects? S : never){
    let branch = getProvider(provider);
    if(!branch){
        Store.set(provider, branch = {})
    }
    if(!branch[storeId]){
        branch[storeId] = { value: store, listeners: {length: {action: noop, watch: [], actual: 0}}, available: [] };
    }
}

export const setStore = _createStore;

type Objects = {[k:string]: any}
type OptionalKeys<T> = {
    [K in keyof T]?: T[K];
};

type StoreCallback<S, R> = (store: S) => R;

// Function overloads
export function _getStore<S>(
  provider: string,
  storeId: string
): S | null;

export function _getStore<S, R>(
  provider: string,
  storeId: string,
  cb: StoreCallback<S, R>
): R | null;


/**
 * Gets a copy of a store's data from a storage provider. This function returns a copy of the store if no callback is provided.    
 * If a callback is provided, then it returns the value returned by the callback. If no such store exists in the storage provider,
 * null is returned.
 * @param provider Storage provider's name
 * @param storeId  Store identifier. A unique string that is used to access a store from a storage provider.
 * @param cb A callback that receives a copy of the store as argument if the store exists. This callback has no effect if store does not exist.     
 * 
 */
// Implementation
export function _getStore<S, R>(
  provider: string,
  storeId: string,
  cb?: StoreCallback<S, R>
): S | R | null {
  let branch = getProvider(provider);
  if (!branch) {
    return null;
  }

  const store = branch[storeId];
  if (!store) {
    return null;
  }

  const storeValue = { ...store.value } as S;

  if (typeof cb === 'function') {
    return cb(storeValue);
  }

  return storeValue;
}

/**
 * Gets a copy of a store's data from a storage provider. This function returns a copy of the store if no callback is provided.    
 * If a callback is provided, then it returns the value returned by the callback. If no such store exists in the storage provider,
 * null is returned.
 * @param provider Storage provider's name
 * @param storeId  Store identifier. A unique string that is used to access a store from a storage provider.
 * @param cb A callback that receives a copy of the store as argument if the store exists. This callback has no effect if store does not exist.     
 * 
 */
export function _createDerivedStore<S>(
  provider: string,
  storeId: string,
  fieldName: keyof S
) {
  let branch = getProvider(provider);
  if (!branch) return;
  const store = branch[storeId];
  if (!store) return;
  const fieldData = store.value[fieldName];
  if(!fieldData||`${fieldData}`!==`${{}}`) return

  const providerName = `${provider}/${storeId}/${String(fieldName)}`;
  branch = DerivedStore.get(providerName);
  if(!branch){
    DerivedStore.set(
      providerName,
      (branch = {
        listeners: { length: { action: noop, watch: [], actual: 0 } },
        available: [],
      })
    );
  }
}


type GetStoreCallback<T, R> = (store: T) => R;

// Function overloads
export function _getDerivedStore<
  S extends Record<string, any>,
  K extends keyof S
>(provider: string, storeId: string, fieldName: K): S[K]|null;

export function _getDerivedStore<
  S extends Record<string, any>,
  K extends keyof S,
  R
>(
  provider: string,
  storeId: string,
  fieldName: K,
  cb: GetStoreCallback<S[K], R>
): R|null;

// Implementation
export function _getDerivedStore<
  S extends Record<string, any>,
  K extends keyof S,
  R
>(
  provider: string,
  storeId: string,
  fieldName: K,
  cb?: GetStoreCallback<S[K], R>
): S[K] | R|null {
  const providerName = `${provider}/${storeId}/${String(fieldName)}`;
  let branch = DerivedStore.get(providerName);

  if (!branch) {
    return null;
  }

  branch = getProvider(provider);
  if (!branch) {
    return null;
  }

  const store = branch[storeId];
  if (!store) {
    return null;
  }

  const fieldValue = store.value[fieldName] || {};

  if (typeof cb === "function") {
    return cb({ ...fieldValue });
  }

  return { ...fieldValue };
}

/**
 * Updates and trigger listners of a store data.
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object.    
 * 
 */
export function _updateDerivedStore<S, K extends keyof S>(
  provider: string,
  storeId: string,
  fieldName: K,
  data: {
    /**
     * An array of properties or fields in the store whose listeners should respond to the changes.
     * If undefined, updates and triggers all subscribed handlers. Set to an empty array `[]` to update without triggering subscribed handlers.
     */
    actors?: Array<keyof S[K]>;
    /** An object with the properties or fields in the store to update. */
    store: OptionalKeys<
      S[K] extends {
        [k: string | number | symbol]: any;
      }
        ? S[K]
        : never
    >;
  }
) {
    const providerName = `${provider}/${storeId}/${String(
      fieldName
    )}`;
    let branch = DerivedStore.get(providerName);
    if (!branch) {
      return
    }
  update(provider, storeId, data, undefined, {...branch, fieldName});
}


/**
 * Removes a store from a storage provider
 * @param provider A name for the storage provider
 * @param storeId Store identifier.
 * 
 */
export function _deleteDerivedStore<S>(provider: string, storeId: string, fieldName: keyof S) {
  const providerName = `${provider}/${storeId}/${String(fieldName)}`;
  DerivedStore.delete(providerName);
}

/**
 * Updates and trigger listners of a store data.
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object.    
 * 
 */
export function _updateStore<S>(provider: string, storeId: string, data: {
    /**
     * An array of properties or fields in the store whose listeners should respond to the changes. 
     * If undefined, updates and triggers all subscribed handlers. Set to an empty array `[]` to update without triggering subscribed handlers.    
     */
    actors?: Array<keyof S>;
    /** An object with the properties or fields in the store to update. */
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
     * If undefined, updates and triggers all subscribed handlers. Set to an empty array `[]` to update without triggering subscribed handlers.    
     */
    actors?: Array<keyof S>;
    /** An object with the properties or fields in the store to update. */
    store: OptionalKeys<S extends {
        [k: string | number | symbol]: any;
    } ? S : never>;
}, ref?: {value:S}, derivedData?: any){
  let branch = getProvider(provider);
  if (!branch) {
    return;
  }
  const store = branch[storeId];
  if (!store) {
    return;
  }
  let { actors, store: newUpdates } = data;

  if (!actors) {
    actors = [];
  }

  let subscribers = store.listeners;
  let storeCopy;
  if (derivedData) {
    const { fieldName } = derivedData;
    const fieldData = store.value[fieldName];
    if (!fieldData) return;
    subscribers = derivedData.listeners;
    store.value[fieldName] = { ...fieldData, ...newUpdates };
    storeCopy = { ...store.value[fieldName] };
  } else {
    store.value = { ...store.value, ...newUpdates };
    if (ref) ref.value = store.value;
    storeCopy = { ...store.value };
  }

  let subscription: { watch?: string[]; action: (store: any) => void } = {
    watch: undefined,
  } as any;
  let watch: string[] | undefined = undefined;
  for (let subscriberId in subscribers) {
    subscription = subscribers[subscriberId];
    if (subscription) {
      watch = subscription.watch;
      if (!watch) {
        // Trigger all listeners
        subscription.action(storeCopy);
      } else {
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

  // Trigger all derived stores of this store
  if (!derivedData) {
    triggerDerivedStoreListners(provider, storeId, actors, storeCopy)
  }

}


const triggerDerivedStoreListners = <S>(provider: string, storeId: string, actors: (keyof S)[], storeCopy: any)=>{
    actors.forEach((actor)=>{
        const providerName = `${provider}/${storeId}/${String(actor)}`;
        let derivedBranch = DerivedStore.get(providerName);
        if (derivedBranch) {
          const subscribers = derivedBranch.listeners;
          let subscription, watch;
          for (let subscriberId in subscribers) {
            subscription = subscribers[subscriberId];
            if (subscription) {
                watch = subscription.watch;
                if(!watch||watch.length>0){
                    subscription.action(storeCopy[actor]);
                }
            }
          }
        }
    });
}

/**
 * Subscribe to changes in a store's data or specific fields in the store.     
 * **Make sure to `unsubscribe` when nomore needed**
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object  
 * 
 */
export function _subscribeToStore<S>(
  provider: string,
  storeId: string,
  data: {
    /**
     * An array of properties or fields in the store to attach a listener.
     * If undefined, this listner shall be triggerered everytime the store's data is updated.
     */
    watch?: Array<keyof S>;
    /** A listenr to be triggered when store's data is updated */
    action: (store: S) => void;
  }
) {
  return _subscribe(provider, storeId, data, undefined);
}

/**
 * Subscribe to changes in a store's data or specific fields in the store.     
 * **Make sure to `unsubscribe` when nomore needed**
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param data Update configuration object  
 * 
 */
export function _subscribeToDerivedStore<S, K extends keyof S>(
  provider: string,
  storeId: string,
  fieldName: K,
  data: {
    /**
     * An array of properties or fields in the store to attach a listener.
     * If undefined, this listner shall be triggerered everytime the store's data is updated.
     */
    watch?: Array<keyof S[K]>;
    /** A listenr to be triggered when store's data is updated */
    action: (store: S[K]) => void;
  }
) {
  return _subscribe(provider, storeId, data, fieldName as any);
}

export function _subscribe<S>(
  provider: string,
  storeId: string,
  data: {
    /**
     * An array of properties or fields in the store to attach a listener.
     * If undefined, this listner shall be triggerered everytime the store's data is updated.
     */
    watch?: Array<keyof S>;
    /** A listenr to be triggered when store's data is updated */
    action: (store: S) => void;
  },
  fieldName?: keyof S
) {

  let branch;
  let store;
  if(fieldName){
    const providerName = `${provider}/${storeId}/${String(
      fieldName
    )}`;
    store = DerivedStore.get(providerName);
    if (!store) return "";

  }else{
    branch = getProvider(provider);
    if(!branch) return "";
    store = branch[storeId];
    if(!store) return "";
  }

  let subscriptionId: string = store.available.pop();
  if (!subscriptionId) {
    subscriptionId = `${store.listeners.length.actual++}`;
  }
  store.listeners[subscriptionId] = { watch: data.watch, action: data.action };
  return subscriptionId;
}

/**
 * Unsubscribe to changes in a store's data. 
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param subscriptionId The subscription ID returned when `subscribe` was called. 
 * 
 */
export function _unsubscribeToStore(provider: string, storeId: string, subscriptionId: string ){
    return _unsubscribe(provider, storeId, subscriptionId, undefined);
}

/**
 * Unsubscribe to changes in a store's data. 
 * @param provider Storage provider's name
 * @param storeId  Store identifier.
 * @param subscriptionId The subscription ID returned when `subscribe` was called. 
 * 
 */
export function _unsubscribeToDerivedStore(provider: string, storeId: string, fieldName: string, subscriptionId: string ){
    return _unsubscribe(provider, storeId, subscriptionId, fieldName);
}

export function _unsubscribe(
  provider: string,
  storeId: string,
  subscriptionId: string,
  fieldName?: string
) {
  let branch;
  let store;
  if (fieldName) {
    const providerName = `${provider}/${storeId}/${String(
      fieldName
    )}`;
    store = DerivedStore.get(providerName);
    if (!store) return;
  } else {
    branch = getProvider(provider);
    if (!branch) return;
    store = branch[storeId];
    if (!store) return;
  }

  store.available.push(subscriptionId);
  store.listeners[subscriptionId] = undefined;
}





