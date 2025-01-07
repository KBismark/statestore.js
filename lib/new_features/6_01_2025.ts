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

/** Returns a function that can be used to update a store with ease */
export const _createStoreUpdater = <S, K=any>({
  provider,
  storeId,
  fieldName
}: {
  provider: string;
  storeId: string;
  fieldName?: K;
}) => {
  return ({
    actors,
    store,
  }: {
    actors?: K extends keyof S ? Array<keyof S[K]> : Array<keyof S>;
    store: Partial<
      K extends keyof S
        ? S[K] extends { [k: string]: any; [k: number]: any; [k: symbol]: any }
          ? S[K]
          : never
        : S extends { [k: string]: any; [k: number]: any; [k: symbol]: any }
        ? S
        : never
    >;
  }) =>
    fieldName
      ? updateDerivedStore<S, keyof S>(provider, storeId, fieldName as any, { actors: actors as any, store })
      : updateStore(provider, storeId, { actors, store });
};


/** Returns a hook to consume data from a store with ease */
export const _createStoreHook = <S, K= any>({
  provider,
  storeId,
  fieldName,
}: {
  provider: string;
  storeId: string;
  fieldName?: K;
}) => {
  return function useState({
    watch,
  }: {
    watch?: K extends keyof S? Array<keyof S[K]>: Array<keyof S>;
  }) {
    return fieldName
      ? useDerivedStateStore<S, K extends keyof S ? K : keyof S>(
          provider,
          storeId,
          fieldName as any,
          watch as any
        )
      : useStateStore<S>(provider, storeId, watch as any);
  };
};
