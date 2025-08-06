import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/constants'

const useProductStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        selectedProducts: [],
        filters: {
          category: 'all',
          sortBy: 'default',
          priceRange: [0, 1000],
          searchTerm: ''
        },
        ui: {
          viewMode: 'grid', // 'grid' | 'list'
          pageSize: 12,
          currentPage: 1
        },

        // Basket Actions - Single Responsibility Principle
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

        // Filter Actions
        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters }
          }), false, 'setFilters')
        },

        resetFilters: () => {
          set({
            filters: {
              category: 'all',
              sortBy: 'default',
              priceRange: [0, 1000],
              searchTerm: ''
            }
          }, false, 'resetFilters')
        },

        // UI Actions
        setViewMode: (viewMode) => {
          set((state) => ({
            ui: { ...state.ui, viewMode }
          }), false, 'setViewMode')
        },

        setPageSize: (pageSize) => {
          set((state) => ({
            ui: { ...state.ui, pageSize, currentPage: 1 }
          }), false, 'setPageSize')
        },

        setCurrentPage: (currentPage) => {
          set((state) => ({
            ui: { ...state.ui, currentPage }
          }), false, 'setCurrentPage')
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
        },

        hasActiveFilters: () => {
          const { filters } = get()
          return filters.category !== 'all' || 
                 filters.sortBy !== 'default' || 
                 filters.searchTerm !== '' ||
                 (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000)
        }
      }),
      {
        name: STORAGE_KEYS.BASKET, // Storage key from constants
        partialize: (state) => ({
          // Only persist basket and user preferences
          selectedProducts: state.selectedProducts,
          ui: {
            viewMode: state.ui.viewMode,
            pageSize: state.ui.pageSize
          }
        }),
        version: 1,
        migrate: (persistedState, version) => {
          // Handle version migrations if needed
          if (version === 0) {
            // Migration logic for version 0 -> 1
            return {
              ...persistedState,
              ui: {
                viewMode: 'grid',
                pageSize: 12,
                currentPage: 1
              }
            }
          }
          return persistedState
        }
      }
    ),
    {
      name: 'product-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

export default useProductStore