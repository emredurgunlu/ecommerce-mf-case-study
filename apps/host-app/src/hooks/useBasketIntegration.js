import { useCallback, useEffect, useState } from 'react'
import { REMOTE_APPS } from '@/utils/constants'

export const useBasketIntegration = () => {
  const [basketUrl, setBasketUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname !== 'localhost'
      setBasketUrl(
        isProduction 
          ? process.env.NEXT_PUBLIC_BASKET_URL || 'https://your-basket-app.vercel.app'
          : REMOTE_APPS.BASKET.URL
      )
    }
  }, [])

  const addToBasket = useCallback((product) => {
    if (typeof window === 'undefined') return
    
    const basketFrame = document.querySelector(`iframe[src*="${basketUrl}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'ADD_TO_BASKET',
        payload: product
      }, basketUrl)
    } else {
      const pendingBasketItems = JSON.parse(localStorage.getItem('pending-basket-items') || '[]')
      pendingBasketItems.push(product)
      localStorage.setItem('pending-basket-items', JSON.stringify(pendingBasketItems))
      
      console.log('Basket remote iframe bulunamadı, ürün geçici olarak kaydedildi')
    }
  }, [basketUrl])

  const removeFromBasket = useCallback((productId) => {
    if (typeof window === 'undefined') return
    
    const basketFrame = document.querySelector(`iframe[src*="${basketUrl}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'REMOVE_FROM_BASKET',
        payload: productId
      }, basketUrl)
    }
  }, [basketUrl])

  const updateQuantity = useCallback((productId, quantity) => {
    if (typeof window === 'undefined') return
    
    const basketFrame = document.querySelector(`iframe[src*="${basketUrl}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity }
      }, basketUrl)
    }
  }, [basketUrl])

  const clearBasket = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const basketFrame = document.querySelector(`iframe[src*="${basketUrl}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'CLEAR_BASKET'
      }, basketUrl)
    }
  }, [basketUrl])

  return {
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket
  }
}