'use client'

import { useState, useEffect } from 'react'
import { REMOTE_APPS } from '@/utils/constants'

/**
 * Remote uygulamaların durumunu yöneten hook
 */
export const useRemotes = () => {
  const [remotesStatus, setRemotesStatus] = useState({
    products: { loaded: false, error: null },
    basket: { loaded: false, error: null },
  })

  // Remote uygulamaların durumunu kontrol et
  useEffect(() => {
    const checkRemoteStatus = async () => {
      try {
        // Products remote durumu
        const productsResponse = await fetch(`${REMOTE_APPS.PRODUCTS.URL}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        
        setRemotesStatus(prev => ({
          ...prev,
          products: {
            loaded: productsResponse.ok,
            error: !productsResponse.ok ? 'Products remote is not available' : null,
          }
        }))
      } catch (error) {
        setRemotesStatus(prev => ({
          ...prev,
          products: {
            loaded: false,
            error: error.message || 'Failed to connect to products remote',
          }
        }))
      }

      // Basket remote durumu için benzer bir kontrol eklenebilir
    }

    checkRemoteStatus()
  }, [])

  return {
    remotesStatus,
  }
}