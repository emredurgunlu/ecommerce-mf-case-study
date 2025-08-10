import { useEffect, useState } from 'react'
import useBasketStore from '../store/useBasketStore'
import { STORAGE_KEYS } from '../utils/constants'

export const useBasket = () => {
  const [allowedOrigins, setAllowedOrigins] = useState([])
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const {
    basketItems,
    addToBasket: storeAddToBasket,
    removeFromBasket: storeRemoveFromBasket,
    updateQuantity: storeUpdateQuantity,
    clearBasket: storeClearBasket,
    getTotalItems,
    getTotalPrice,
    getFormattedTotalPrice
  } = useBasketStore()

  // Wrapped functions to use store actions directly
  const addToBasket = (product) => {
    console.log('[useBasket] addToBasket çağrıldı:', product);
    storeAddToBasket(product);
  };

  const removeFromBasket = (productId) => {
    storeRemoveFromBasket(productId);
  };

  const updateQuantity = (productId, quantity) => {
    storeUpdateQuantity(productId, quantity);
  };

  const clearBasket = () => {
    storeClearBasket();
  };

  // Set allowed origins based on environment
  useEffect(() => {
    console.log('[Basket] Initializing basket with window.origin:', window.origin);
    if (typeof window === 'undefined') return;

    // More accurate environment detection
    const isProduction = process.env.NODE_ENV === 'production' || 
                        window.location.hostname.includes('vercel.app');
    
    console.log(`[Basket] Environment: ${isProduction ? 'Production' : 'Development'}`);
    
    // Always include the current origin and common development origins
    const origins = new Set([
      window.location.origin,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://ecommerce-mf-case-study-host-app.vercel.app',
      'https://ecommerce-mf-case-study-basket-remote.vercel.app',
      'https://ecommerce-mf-case-study-products-re.vercel.app',
      'https://ecommerce-mf-case-study-basket-remo.vercel.app'
    ]);
    
    // Add wildcard pattern for all vercel deployments
    if (isProduction) {
      origins.add('https://ecommerce-mf-case-study-host-app-git-main-emredurgunlus-projects.vercel.app');
      origins.add('https://ecommerce-mf-case-study-host-app-emredurgunlus-projects.vercel.app');
    }
    
    // Add environment-specific origins if defined
    if (process.env.REACT_APP_HOST_URL) {
      origins.add(process.env.REACT_APP_HOST_URL);
    }
    
    // If we're in an iframe, request the current basket state from the parent
    if (window.parent !== window) {
      try {
        console.log('[Basket] Requesting initial basket state from parent');
        window.parent.postMessage({ 
          type: 'REQUEST_BASKET_STATE' 
        }, '*');
      } catch (e) {
        console.warn('[Basket] Could not request basket state from parent:', e);
      }
    }
    
    // Add parent origin if we're in an iframe
    if (window.parent !== window) {
      try {
        // This will only work if the parent is from the same origin
        // For cross-origin iframes, we'll rely on the postMessage origin
        origins.add(window.parent.location.origin);
      } catch (e) {
        // This is expected in cross-origin iframes
        console.log('[Basket] Parent origin not accessible (expected in cross-origin iframes)');
      }
    }
    
    // Convert Set to array and log
    const allowedOriginsArray = Array.from(origins);
    console.log(`[Basket] Allowed origins (${isProduction ? 'Production' : 'Development'}):`, allowedOriginsArray);
    setAllowedOrigins(allowedOriginsArray);
  }, [])

  // Listen for basket state updates from the parent
  useEffect(() => {
    const handleBasketStateUpdate = (event) => {
      try {
        // Skip if no data or not from a trusted origin
        if (!event.data || !event.data.type) return;
        
        // Log all messages for debugging
        console.log('[Basket] Received message:', event.data, 'from origin:', event.origin);

        // Handle basket state updates
        if (event.data.type === 'BASKET_STATE_UPDATE') {
          console.log('[Basket] Received basket state update from parent:', event.data.payload);
          
          // Update the local basket state with the one from the parent
          const { items } = event.data.payload;
          if (Array.isArray(items)) {
            console.log('[Basket] Updating local basket state with items:', items);
            
            // Clear the current basket and add all items from the parent
            storeClearBasket();
            
            // Add each item to the basket
            items.forEach(item => {
              if (item && item.id) { // Basic validation
                storeAddToBasket(item);
              }
            });
          }
        }
      } catch (error) {
        console.error('[Basket] Error handling message:', error);
      }
    };

    // Add the event listener
    window.addEventListener('message', handleBasketStateUpdate);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('message', handleBasketStateUpdate);
    };
  }, [storeAddToBasket, storeClearBasket]);

  // Listen for messages from the parent
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event) => {
      console.log('[Basket] postMessage geldi:', event);

      if (!allowedOrigins.length) {
        console.warn('[Basket] allowedOrigins henüz hazır değil');
        return;
      }

      // Check if the origin is allowed using a more flexible matching
      const isOriginAllowed = allowedOrigins.some(allowedOrigin => {
        // Exact match
        if (allowedOrigin === event.origin) return true;
        
        return false;
      }) || 
      // Allow all vercel.app domains for ecommerce-mf-case-study project
      (event.origin && event.origin.includes('ecommerce-mf-case-study') && event.origin.includes('vercel.app'));
      
      if (!isOriginAllowed) {
        console.warn('[Basket] Origin not allowed:', event.origin, 'Allowed origins:', allowedOrigins);
        return;
      }

      if (!event.data || typeof event.data !== 'object' || !('type' in event.data)) {
        console.warn('[Basket] Geçersiz mesaj formatı:', event.data);
        return;
      }

      const { type, payload } = event.data;
      console.log('[Basket] Mesaj türü:', type);

      switch (type) {
        case 'ADD_TO_BASKET':
          console.log('[Basket] Ürün ekleniyor:', payload);
          addToBasket(payload);
          break;
        case 'REMOVE_FROM_BASKET':
          removeFromBasket(payload);
          break;
        case 'UPDATE_QUANTITY':
          updateQuantity(payload.id, payload.quantity);
          break;
        case 'CLEAR_BASKET':
          clearBasket();
          break;
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
            }, '*');
          }
          break;
        default:
          console.warn('[Basket] Tanınmayan mesaj tipi:', type, 'Gelen data:', event.data);
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'BASKET_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [
    allowedOrigins.length,
    basketItems,
    getTotalItems,
    getTotalPrice,
    getFormattedTotalPrice
  ]);

  // Force component update when localStorage changes
  useEffect(() => {
    console.log('[useBasket] basketItems değişti:', basketItems);
  }, [basketItems]);

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