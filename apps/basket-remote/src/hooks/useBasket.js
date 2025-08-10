import { useEffect, useState } from 'react'
import useBasketStore from '../store/useBasketStore'

export const useBasket = () => {
  const [allowedOrigins, setAllowedOrigins] = useState([])
  
  const {
    basketItems,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    getTotalItems,
    getTotalPrice,
    getFormattedTotalPrice
  } = useBasketStore()

  // Set allowed origins based on environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname !== 'localhost'
      
      if (isProduction) {
        setAllowedOrigins([
          window.location.origin,
          process.env.REACT_APP_HOST_URL || 'https://your-host-app.vercel.app',
          process.env.REACT_APP_PRODUCTS_URL || 'https://your-products-app.vercel.app'
        ])
      } else {
        setAllowedOrigins([
          window.location.origin,
          'http://localhost:3000',
          'http://localhost:3001'
        ])
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleMessage = (event) => {
      // Security check - only accept messages from trusted origins
      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      const { type, payload } = event.data

      switch (type) {
        case 'ADD_TO_BASKET':
          addToBasket(payload)
          break
        case 'REMOVE_FROM_BASKET':
          removeFromBasket(payload)
          break
        case 'UPDATE_QUANTITY':
          updateQuantity(payload.id, payload.quantity)
          break
        case 'CLEAR_BASKET':
          clearBasket()
          break
        case 'GET_BASKET_STATE':
          if (window.parent !== window) {
            window.parent.postMessage({
              type: 'BASKET_STATE',
              payload: {
                items: basketItems,
                totalItems: getTotalItems(),
                totalPrice: getTotalPrice(),
                formattedTotalPrice: getFormattedTotalPrice()
              }
            }, '*')
          }
          break
        default:
          break
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify parent that basket is ready
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'BASKET_READY'
      }, '*')
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [allowedOrigins, basketItems, addToBasket, removeFromBasket, updateQuantity, clearBasket, getTotalItems, getTotalPrice, getFormattedTotalPrice])

  return {
    basketItems,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    getTotalItems,
    getTotalPrice,
    getFormattedTotalPrice
  }
}