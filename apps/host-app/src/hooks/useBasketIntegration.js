import { useCallback } from 'react'
import { REMOTE_APPS } from '@/utils/constants'

/**
 * Basket remote ile entegrasyon için hook
 * Single Responsibility: Sepet işlemleri için window.postMessage kullanımı
 */
export const useBasketIntegration = () => {
  // Ürünü sepete ekle
  const addToBasket = useCallback((product) => {
    // Basket remote iframe'ine mesaj gönder
    const basketFrame = document.querySelector(`iframe[src*="${REMOTE_APPS.BASKET.URL}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'ADD_TO_BASKET',
        payload: product
      }, REMOTE_APPS.BASKET.URL)
    } else {
      // Iframe bulunamadıysa localStorage'a kaydet, daha sonra senkronize edilebilir
      const pendingBasketItems = JSON.parse(localStorage.getItem('pending-basket-items') || '[]')
      pendingBasketItems.push(product)
      localStorage.setItem('pending-basket-items', JSON.stringify(pendingBasketItems))
      
      console.log('Basket remote iframe bulunamadı, ürün geçici olarak kaydedildi')
    }
  }, [])

  // Sepetten ürün çıkar
  const removeFromBasket = useCallback((productId) => {
    const basketFrame = document.querySelector(`iframe[src*="${REMOTE_APPS.BASKET.URL}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'REMOVE_FROM_BASKET',
        payload: productId
      }, REMOTE_APPS.BASKET.URL)
    }
  }, [])

  // Ürün miktarını güncelle
  const updateQuantity = useCallback((productId, quantity) => {
    const basketFrame = document.querySelector(`iframe[src*="${REMOTE_APPS.BASKET.URL}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity }
      }, REMOTE_APPS.BASKET.URL)
    }
  }, [])

  // Sepeti temizle
  const clearBasket = useCallback(() => {
    const basketFrame = document.querySelector(`iframe[src*="${REMOTE_APPS.BASKET.URL}"]`)
    
    if (basketFrame && basketFrame.contentWindow) {
      basketFrame.contentWindow.postMessage({
        type: 'CLEAR_BASKET'
      }, REMOTE_APPS.BASKET.URL)
    }
  }, [])

  return {
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket
  }
}