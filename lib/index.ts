
import * as StateStore from "./global_store";
import * as ContextsStore from "./context_store";
import * as ReactStore from "./react_env"
// Exporting at once `export const {/*...*/} = StateStore` is causing errors in final typescript output
// Export each separately
export const getStore = StateStore.getStore;
export const subscribe = StateStore.subscribe;
export const unsubscribe = StateStore.unsubscribe;
export const updateStore = StateStore.updateStore;
export const deleteProvider = StateStore.deleteProvider;
export const deleteStore = StateStore.deleteStore;
export const createStore = StateStore.createStore;
export const getContext = ContextsStore.getContext;
export const updateContext = ContextsStore.updateContext;
export const createContext = ContextsStore.createContext;
export const subscribeToContext = ContextsStore.subscribeToContext;
export const unsubscribeToContext = ContextsStore.unsubscribeToContext;
export const destroyContext = ContextsStore.destroyContext;
export type ContextId = ContextsStore.ContextId
/** ----------------------For Usage In React----------------------- */
export const configureForReact = ReactStore.configureForReact;
export const useStateContext = ReactStore.useStateContext;
export const useStateStore = ReactStore.useStateStore;
export const createComponent = ReactStore.createComponent;

