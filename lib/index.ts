
import * as StateStore from "./global_store";
import * as ContextsStore from "./context_store";
export const { getStore, subscribe, unsubscribe, updateStore } = StateStore;
export const {getContext, updateContext,createContext, subscribeToContext, unsubscribeToContext} = ContextsStore;
