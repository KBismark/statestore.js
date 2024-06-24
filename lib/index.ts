
import * as StateStore from "./global_store";
import * as ContextsStore from "./context_store";
export const { getStore, subscribe, unsubscribe, updateStore, deleteProvider, deleteStore, createStore } = StateStore;
export const {getContext, updateContext,createContext, subscribeToContext, unsubscribeToContext, destroyContext} = ContextsStore;
export type ContextId = ContextsStore.ContextId
