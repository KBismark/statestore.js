
import * as StateStore from "./global_store";
import * as ContextsStore from "./context_store";
import * as ReactStore from "./react_env"
import { _createStoreHook, _createStoreUpdater, _getAllStoreNames, _getAllStores } from "./new_features/6_01_2025";
// Exporting at once `export const {/*...*/} = StateStore` is causing errors in final typescript output
// Export each separately
export const getStorageProvider = StateStore.getProvider;
export const getStore = StateStore._getStore;
export const getAllStores = _getAllStores;
export const getAllStoreNames = _getAllStoreNames;
export const subscribe = StateStore._subscribeToStore;
export const unsubscribe = StateStore._unsubscribe;
export const updateStore = StateStore._updateStore;
export const deleteProvider = StateStore._deleteProvider;
export const deleteStore = StateStore._deleteStore;
export const createStore = StateStore._createStore;
export const getContext = ContextsStore._getContext;
export const updateContext = ContextsStore._updateContext;
export const createContext = ContextsStore._createContext;
export const subscribeToContext = ContextsStore._subscribeToContext;
export const unsubscribeToContext = ContextsStore._unsubscribeToContext;
export const destroyContext = ContextsStore._destroyContext;
export const createStoreUpdater = _createStoreUpdater;
export const createStoreHook = _createStoreHook;
export const subscribeToDerivedStore = StateStore._subscribeToDerivedStore;
export const unsubscribeToDerivedStore = StateStore._unsubscribeToDerivedStore;
export const deleteDerivedStore = StateStore._deleteDerivedStore;
export const getDerivedStore = StateStore._getDerivedStore;
export const createDerivedStore = StateStore._createDerivedStore;
export const updateDerivedStore = StateStore._updateDerivedStore;
export type ContextId = ContextsStore._ContextId

/** ----------------------For Usage In React----------------------- */
export const configureForReact = ReactStore._configureForReact;
export const useStateContext = ReactStore._useStateContext;
export const useStateStore = ReactStore._useStateStore;
export const useDerivedStateStore = ReactStore._useDerivedStore;
export const createComponent = ReactStore._createComponent;

