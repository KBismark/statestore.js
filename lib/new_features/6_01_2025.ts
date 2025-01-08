import { getStorageProvider, updateDerivedStore, updateStore, useDerivedStateStore, useStateStore } from "..";

export const _getAllStores = <S>(provider: string):S[]=>{
    const storage = getStorageProvider(provider);
    if(!storage) return []
    return Object.values(storage).map((store) => (store as {value: S}).value);
}

export const _getAllStoreNames = (provider: string): string[] => {
  const storage = getStorageProvider(provider);
  if (!storage) return [];
  return Object.keys(storage);
};

type ObjectType = Record<string | number | symbol, any>;

// Configuration type
type UpdaterConfig<S, K = never> = {
  provider: string;
  storeId: string;
  fieldName?: K;
};

// Options type for the update function
type UpdateOptions<S, K> = {
  actors?: K extends keyof S ? Array<keyof S[K]> : Array<keyof S>;
  store: K extends keyof S 
    ? Partial<S[K] & ObjectType>
    : Partial<S & ObjectType>;
};

/**
 * Creates a function to update store values with type safety
 * @template S The store type
 * @template K The optional field key type
 */
export function _createStoreUpdater<S extends ObjectType, K = unknown>(
  config: UpdaterConfig<S, K>
) {
  return function update(options: {
    actors?: K extends keyof S ? Array<keyof S[K]> : Array<keyof S>;
    store: K extends keyof S
      ? Partial<S[K]>
      : Partial<S>;
  }) {
    const { provider, storeId, fieldName } = config;
    const { actors, store } = options;

    if (typeof fieldName === "string") {
      return updateDerivedStore<S, K & keyof S>(provider, storeId, fieldName, {
        actors,
        store,
      });
    }

    return updateStore(provider, storeId, {
      actors,
      store,
    });
  };
}

// Type for the store hook configuration
type StoreHookConfig<S> = {
  provider: string;
  storeId: string;
  fieldName?: keyof S;
};

// Type for the watch options
type WatchOptions<S> = {
  watch?: Array<keyof S>;
};

/**
 * Creates a custom hook for consuming store data with optional field selection
 * @template S The store type
 */
export function _createStoreHook<S extends Record<string, any>, K=unknown >(
  config: StoreHookConfig<S>
) {
  return function useStore(
    options?: WatchOptions<K extends keyof S ? S[K] : S>
  ) {
    const { provider, storeId, fieldName } = config;
    const watch = options?.watch;
    type ReturnType = K extends keyof S ? S[K] : S;

    if (fieldName) {
      return useDerivedStateStore<S, typeof fieldName>(
        provider,
        storeId,
        fieldName,
        watch 
      ) as ReturnType|null;
    }

    return useStateStore<S>(provider, storeId, watch as any) as ReturnType|null;
  };
}
