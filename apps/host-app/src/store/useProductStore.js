import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/constants'

// Sabit değer yerine constants'tan gelen değeri kullanalım
// const BASKET_STORAGE_KEY = 'host-app-basket'

const useProductStore = create()(  
  devtools(
    persist(
      (set, get) => ({
        // State
        selectedProducts: [],

        // Basket Actions
        addToBasket: (product) => {
          const { selectedProducts } = get()
          const existingProduct = selectedProducts.find(p => p.id === product.id)
          
          if (existingProduct) {
            set((state) => ({
              selectedProducts: state.selectedProducts.map(p =>
                p.id === product.id 
                  ? { ...p, quantity: p.quantity + 1 }
                  : p
              )
            }), false, 'addToBasket/increment')
          } else {
            set((state) => ({
              selectedProducts: [...state.selectedProducts, { ...product, quantity: 1 }]
            }), false, 'addToBasket/new')
          }
        },

        removeFromBasket: (productId) => {
          set((state) => ({
            selectedProducts: state.selectedProducts.filter(p => p.id !== productId)
          }), false, 'removeFromBasket')
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromBasket(productId)
            return
          }

          set((state) => ({
            selectedProducts: state.selectedProducts.map(p =>
              p.id === productId ? { ...p, quantity } : p
            )
          }), false, 'updateQuantity')
        },

        clearBasket: () => {
          set({ selectedProducts: [] }, false, 'clearBasket')
        },

        // Computed Values (Getters)
        getTotalItems: () => {
          const { selectedProducts } = get()
          return selectedProducts.reduce((total, product) => total + product.quantity, 0)
        },

        getTotalPrice: () => {
          const { selectedProducts } = get()
          return selectedProducts.reduce((total, product) => 
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
          const { selectedProducts } = get()
          return selectedProducts.some(p => p.id === productId)
        },

        getProductQuantityInBasket: (productId) => {
          const { selectedProducts } = get()
          const product = selectedProducts.find(p => p.id === productId)
          return product?.quantity || 0
        }
      }),
      {
        name: STORAGE_KEYS.BASKET, // Sabit değer yerine constants'tan gelen değeri kullanalım
        partialize: (state) => ({
          // Only persist basket
          selectedProducts: state.selectedProducts
        }),
        version: 1
      }
    ),
    {
      name: 'host-product-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

export default useProductStore