'use client'

import { useState, useEffect } from 'react'
import { Alert, Spin } from 'antd'

/**
 * Remote uygulamaları yüklemek için wrapper bileşeni
 * 
 * @param {string} url - Remote uygulamanın URL'i
 * @param {string} name - Remote uygulamanın adı
 * @param {React.ReactNode} fallback - Yükleme sırasında gösterilecek içerik
 * @param {React.ReactNode} errorComponent - Hata durumunda gösterilecek içerik
 */
export default function RemoteWrapper({ url, name, fallback, errorComponent, children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Burada remote uygulamayı yükleme işlemi yapılacak
    // Şimdilik sadece bir simülasyon
    const timer = setTimeout(() => {
      setLoading(false)
      // Hata simülasyonu için yorum satırını kaldırabilirsiniz
      // setError(new Error('Failed to load remote application'))
    }, 1500)

    return () => clearTimeout(timer)
  }, [url, name])

  if (loading) {
    return fallback || (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin tip="Yükleniyor..." size="large">
          <div style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
            {name} uygulaması yükleniyor...
          </div>
        </Spin>
      </div>
    )
  }

  if (error) {
    return errorComponent || (
      <Alert
        message="Yükleme Hatası"
        description={`${name} uygulaması yüklenirken bir hata oluştu: ${error.message}`}
        type="error"
        showIcon
      />
    )
  }

  return children
}