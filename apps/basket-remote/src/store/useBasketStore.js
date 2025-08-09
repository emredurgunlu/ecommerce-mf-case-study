import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../utils/constants'

const useBasketStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        basketItems: [],

        // Basket Actions - Single Responsibility Principle
        addToBasket: (product) => {
          const { basketItems } = get()
          const existingProduct = basketItems.find(p => p.id === product.id)
          
          if (existingProduct) {
            set((state) => ({
              basketItems: state.basketItems.map(p =>
                p.id === product.id 
                  ? { ...p, quantity: p.quantity + 1 }
                  : p
              )
            }), false, 'addToBasket/increment')
          } else {
            set((state) => ({
              basketItems: [...state.basketItems, { ...product, quantity: 1 }]
            }), false, 'addToBasket/new')
          }
        },

        removeFromBasket: (productId) => {
          set((state) => ({
            basketItems: state.basketItems.filter(p => p.id !== productId)
          }), false, 'removeFromBasket')
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromBasket(productId)
            return
          }

          set((state) => ({
            basketItems: state.basketItems.map(p =>
              p.id === productId ? { ...p, quantity } : p
            )
          }), false, 'updateQuantity')
        },

        clearBasket: () => {
          set({ basketItems: [] }, false, 'clearBasket')
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
        partialize: (state) => ({
          basketItems: state.basketItems
        }),
        version: 1
      }
    ),
    {
      name: 'basket-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

export default useBasketStore