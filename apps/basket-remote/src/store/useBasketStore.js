import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/constants'

const useBasketStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        basketItems: [],
        lastUpdate: 0, // Add a timestamp to force re-renders

        // Basket Actions - Single Responsibility Principle
        addToBasket: (product) => {
          console.log('[Store] addToBasket called with product:', product);
          const { basketItems } = get()
          const existingProduct = basketItems.find(p => p.id === product.id)
          
          let newItems;
          if (existingProduct) {
            newItems = basketItems.map(p =>
              p.id === product.id 
                ? { ...p, quantity: p.quantity + 1 }
                : p
            );
            console.log('[Store] Updated existing product, new items:', newItems);
          } else {
            newItems = [...basketItems, { ...product, quantity: 1 }];
            console.log('[Store] Added new product, new items:', newItems);
          }
          
          // Update state with both items and timestamp
          set({ 
            basketItems: newItems,
            lastUpdate: Date.now()
          }, false, 'addToBasket/update')
        },

        removeFromBasket: (productId) => {
          console.log('[Store] removeFromBasket called for productId:', productId);
          const newItems = get().basketItems.filter(p => p.id !== productId);
          set({ 
            basketItems: newItems,
            lastUpdate: Date.now()
          }, false, 'removeFromBasket')
        },

        updateQuantity: (productId, quantity) => {
          console.log('[Store] updateQuantity called for productId:', productId, 'quantity:', quantity);
          if (quantity <= 0) {
            get().removeFromBasket(productId);
            return;
          }

          const newItems = get().basketItems.map(p =>
            p.id === productId ? { ...p, quantity } : p
          );
          set({ 
            basketItems: newItems,
            lastUpdate: Date.now()
          }, false, 'updateQuantity');
        },

        clearBasket: () => {
          console.log('[Store] clearBasket called');
          set({ 
            basketItems: [],
            lastUpdate: Date.now()
          }, false, 'clearBasket');
        },

        // Computed Values (Getters)
        getTotalItems: () => {
          const { basketItems } = get()
          return basketItems.reduce((total, product) => total + product.quantity, 0)
        },

        getTotalPrice: () => {
          const { basketItems } = get()
          return basketItems.reduce((total, product) => 
            total + (product.price * product.quantity), 0
          )
        },

        getFormattedTotalPrice: () => {
          const total = get().getTotalPrice()
          return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'USD'
          }).format(total)
        },

        isProductInBasket: (productId) => {
          const { basketItems } = get()
          return basketItems.some(p => p.id === productId)
        },

        getProductQuantityInBasket: (productId) => {
          const { basketItems } = get()
          const product = basketItems.find(p => p.id === productId)
          return product?.quantity || 0
        }
      }),
      {
        name: STORAGE_KEYS.BASKET,
        // Only persist the basketItems in localStorage
        partialize: (state) => ({
          basketItems: state.basketItems
        }),
        version: 1,
        // Force persistence even in production
        skipHydration: false,
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            console.log('[Store] Loading from localStorage:', name, str);
            return str ? JSON.parse(str) : null;
          },
          setItem: (name, value) => {
            console.log('[Store] Saving to localStorage:', name, value);
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            console.log('[Store] Removing from localStorage:', name);
            localStorage.removeItem(name);
          }
        },
        onRehydrateStorage: () => (state) => {
          console.log('[Store] Rehydration started');
          return (state, error) => {
            if (error) {
              console.error('[Store] Error during rehydration:', error);
            } else {
              console.log('[Store] Rehydration completed:', state);
              // Force an update after rehydration
              if (state) {
                state.lastUpdate = Date.now();
              }
            }
          };
        }
      }
    ),
    {
      name: 'basket-store',
      enabled: true // Production'da da devtools'u aktif et
    }
  )
)

export default useBasketStore