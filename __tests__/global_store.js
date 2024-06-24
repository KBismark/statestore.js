const { setStore, getStore, createProvider, getPorvider } = require("../lib/global_store");
const Store = new Map();


describe('setStore', () => {

    // correctly sets a new store when provider does not exist
    it('should set a new store when provider does not exist', () => {
        const provider = 'newProvider';
        const storeId = 'storeId1';
        const store = { key: 'value' };
        
        createProvider(provider)
        setStore(provider, storeId, store);
    
        const branch = getPorvider(provider);
        expect(branch).toBeDefined();
        expect(branch[storeId]).toBeDefined();
        expect(branch[storeId].value).toEqual(store);
    });

    // handles empty string as provider
    it('should handle empty string as provider', () => {
        const provider = '';
        const storeId = 'storeId2';
        const store = { key: 'value' };
        createProvider(provider)
        setStore(provider, storeId, store);
    
        const branch = getPorvider(provider);
        expect(branch).toBeDefined();
        expect(branch[storeId]).toBeDefined();
        expect(branch[storeId].value).toEqual(store);
    });

    // correctly sets a new store when provider exists but storeId does not
    it('should set a new store when provider exists but storeId does not', () => {
        const provider = 'existingProvider';
        const storeId = 'newStoreId';
        const store = { key: 'value' };

        createProvider(provider)

        setStore(provider, storeId, store);

        const branch = getPorvider(provider);
        expect(branch).toBeDefined();
        expect(branch[storeId]).toBeDefined();
        expect(branch[storeId].value).toEqual(store);
    });

    // ensures Store is a singleton and maintains state across function calls
    it('should maintain state across function calls', () => {
        const provider = 'testProvider';
        const storeId = 'testStoreId';
        const store1 = { key: 'value1' };
        const store2 = { key: 'value2' };

        createProvider(provider)
        setStore(provider, storeId, store1);
        setStore(provider, storeId, store2);

        const branch = getPorvider(provider);
        expect(branch).toBeDefined();
        expect(branch[storeId]).toBeDefined();
        expect(branch[storeId].value).toEqual(store1);
    });
});



describe('getStore', () => {

    // Returns a copy of the store when it exists and no callback is provided
    it('should return a copy of the store when it exists and no callback is provided', () => {
        const provider = 'testProvider';
        const storeId = 'testStore';
        const storeValue = { key: 'value' };
        createProvider(provider)
        setStore(provider, storeId, storeValue)
        const result = getStore(provider, storeId);
    
        expect(result).toEqual(storeValue);
        expect(result).not.toBe(storeValue); 
    });

    // Returns the value from the callback when it exists and the callback is provided
    it('should return the value from the callback when it exists and the callback is provided', () => {
        const provider = 'testProvider';
        const storeId = 'testStore';
        const storeValue = { key: 'value' };
        createProvider(provider)
        setStore(provider, storeId, storeValue)

        const callback = jest.fn().mockReturnValue('value');
        const result = getStore(provider, storeId, callback);

        expect(result).toEqual('value');
        expect(callback).toHaveBeenCalledWith(storeValue);
    });

    // Returns null when the store does not exist in the provider
    it('should return null when the store does not exist in the provider', () => {
        const provider = 'testProvider';
        const storeId = 'nonExistentStore';

        createProvider(provider)

        const result = getStore(provider, storeId);

        expect(result).toBeNull();
    });

    // Returns null when the provider does not exist
    it('should return null when the provider does not exist', () => {
        const provider = 'nonExistentProvider';
        const storeId = 'testStore';

        const result = getStore(provider, storeId);

        expect(result).toBeNull();
    });

   
});
