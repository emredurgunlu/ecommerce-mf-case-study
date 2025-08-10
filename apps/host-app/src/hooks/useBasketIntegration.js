import { useCallback, useEffect, useState, useRef } from 'react'
import { REMOTE_APPS } from '@/utils/constants'

export const useBasketIntegration = () => {
  const [basketUrl, setBasketUrl] = useState('')
  const [isBasketReady, setIsBasketReady] = useState(false)
  const isMounted = useRef(true)
  const basketIframeRef = useRef(null)

  // Initialize basket URL and set up message listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    console.log('[BasketIntegration] Environment:', isProduction ? 'Production' : 'Development');
    console.log('[BasketIntegration] Current hostname:', window.location.hostname);
    
    // Resolve the basket URL with fallbacks
    let resolvedUrl;
    if (isProduction) {
      resolvedUrl = process.env.NEXT_PUBLIC_BASKET_URL || 
                   REMOTE_APPS.BASKET.URL || 
                   'https://ecommerce-mf-case-study-basket-remo.vercel.app';
    } else {
      resolvedUrl = REMOTE_APPS.BASKET.URL || 'http://localhost:3002';
    }

    console.log('[BasketIntegration] Resolved basket URL:', resolvedUrl);
    setBasketUrl(resolvedUrl);

    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Skip if no data
      if (!event.data || !event.source) return;
      
      console.log('[BasketIntegration] Message received from iframe:', event.data, 'Origin:', event.origin);

      // Handle basket state request from the iframe
      if (event.data.type === 'REQUEST_BASKET_STATE') {
        console.log('[BasketIntegration] Sending current basket state to iframe');
        // Get the current basket items from the host app
        const basketItems = []; // Replace this with how you get basket items in the host app
        
        try {
          // Send the current basket state to the iframe
          event.source.postMessage({
            type: 'BASKET_STATE_UPDATE',
            payload: { items: basketItems }
          }, event.origin);
        } catch (e) {
          console.error('[BasketIntegration] Error sending basket state to iframe:', e);
        }
        return;
      }

      // For other message types, verify the origin if we have a valid basketUrl
      if (basketUrl) {
        try {
          const basketOrigin = new URL(basketUrl).origin;
          if (event.origin !== basketOrigin) {
            console.warn('[BasketIntegration] Message from unauthorized origin:', event.origin);
            return;
          }
        } catch (e) {
          console.warn('[BasketIntegration] Invalid basket URL for origin check:', basketUrl);
          // Continue processing the message even if URL parsing fails
        }
      }

      // Handle basket ready message from iframe
      if (event.data.type === 'BASKET_READY') {
        console.log('[BasketIntegration] Basket remote is ready');
        setIsBasketReady(true);
        // Process any pending basket items
        const pendingBasketItems = JSON.parse(localStorage.getItem('pending-basket-items') || '[]');
        if (pendingBasketItems.length > 0) {
          console.log('[BasketIntegration] Processing pending basket items:', pendingBasketItems);
          pendingBasketItems.forEach(item => {
            sendToBasket('ADD_TO_BASKET', item);
          });
          localStorage.removeItem('pending-basket-items');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      isMounted.current = false;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Send basket actions to the iframe
  const sendToBasket = useCallback((action, payload) => {
    if (!basketIframeRef.current || !basketUrl || !isBasketReady) {
      console.warn('[BasketIntegration] Basket iframe or URL not ready');
      return;
    }

    const message = { type: action, payload };
    console.log('[BasketIntegration] Sending to basket iframe:', message);
    
    try {
      // Only proceed if we have a valid URL
      let targetOrigin = '*';
      try {
        const url = new URL(basketUrl);
        targetOrigin = url.origin;
      } catch (e) {
        console.warn('[BasketIntegration] Using wildcard origin due to invalid basket URL:', basketUrl);
      }
      
      // Send the action
      basketIframeRef.current.contentWindow.postMessage(message, targetOrigin);
      
      // Also send the full basket state after each update
      if (['ADD_TO_BASKET', 'REMOVE_FROM_BASKET', 'UPDATE_QUANTITY', 'CLEAR_BASKET'].includes(action)) {
        const basketItems = []; // Replace this with how you get basket items in the host app
        console.log('[BasketIntegration] Sending full basket state to iframe');
        basketIframeRef.current.contentWindow.postMessage({
          type: 'BASKET_STATE_UPDATE',
          payload: { items: basketItems }
        }, targetOrigin);
      }
    } catch (error) {
      console.error('[BasketIntegration] Error sending message to basket iframe:', error);
    }
  }, [basketUrl]);

  // Add product to basket
  const addToBasket = useCallback((product) => {
    if (typeof window === 'undefined') return;

    console.log('[BasketIntegration] Adding product to basket:', product);
    
    // Try to send the message to the iframe
    sendToBasket('ADD_TO_BASKET', product);
    
    if (!basketIframeRef.current || !isBasketReady) {
      console.warn('[BasketIntegration] Could not send message to basket iframe. Storing in localStorage.');
      const pendingBasketItems = JSON.parse(localStorage.getItem('pending-basket-items') || '[]');
      pendingBasketItems.push(product);
      localStorage.setItem('pending-basket-items', JSON.stringify(pendingBasketItems));
      console.info('[BasketIntegration] Pending items updated:', pendingBasketItems);
    }
  }, [basketUrl]);

  // Remove product from basket
  const removeFromBasket = useCallback((productId) => {
    if (typeof window === 'undefined') return;
    console.log(`[BasketIntegration] Removing product ${productId} from basket`);
    sendToBasket('REMOVE_FROM_BASKET', productId);
  }, [basketUrl, sendToBasket]);

  // Update product quantity in basket
  const updateQuantity = useCallback((productId, quantity) => {
    if (typeof window === 'undefined') return;
    console.log(`[BasketIntegration] Updating quantity for product ${productId} to ${quantity}`);
    sendToBasket('UPDATE_QUANTITY', { id: productId, quantity });
  }, [basketUrl, sendToBasket]);

  // Clear the entire basket
  const clearBasket = useCallback(() => {
    if (typeof window === 'undefined') return;
    console.log('[BasketIntegration] Clearing basket');
    sendToBasket('CLEAR_BASKET');
  }, [basketUrl, sendToBasket]);

  return {
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    basketIframeRef
  };
};