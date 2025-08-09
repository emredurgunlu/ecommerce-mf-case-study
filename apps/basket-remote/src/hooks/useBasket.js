import { useEffect } from 'react'
import useBasketStore from '../store/useBasketStore'

/**
 * Custom hook for basket operations
 * Single Responsibility: Handles basket operations and window messaging
 */
export const useBasket = () => {
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

  // Listen for messages from host app
  useEffect(() => {
    const handleMessage = (event) => {
      // Security check - only accept messages from trusted origins
      // In production, you would check against your actual host domain
      if (event.origin !== window.location.origin && 
          event.origin !== 'http://localhost:3000' &&
          event.origin !== 'http://localhost:3001') {
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
          // Send basket state back to host
          window.parent.postMessage({
            type: 'BASKET_STATE',
            payload: {
              items: basketItems,
              totalItems: getTotalItems(),
              totalPrice: getTotalPrice(),
              formattedTotalPrice: getFormattedTotalPrice()
            }
          }, '*')
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
  }, [basketItems, addToBasket, removeFromBasket, updateQuantity, clearBasket, getTotalItems, getTotalPrice, getFormattedTotalPrice])

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