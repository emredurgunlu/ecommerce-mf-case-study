'use client'

import { Spin, Alert, Typography } from 'antd'
import { useProducts, useCategories } from '@/hooks/useProducts'
import useProductStore from '@/store/useProductStore'

const { Title, Text } = Typography

export default function Home() {
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts()
  
  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useCategories()
  
  const { 
    selectedProducts, 
    addToBasket, 
    getTotalItems,
    getTotalPrice 
  } = useProductStore()

  if (productsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Ürünler yükleniyor...</Text>
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <Alert
        message="Hata"
        description={productsError.message}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={1}>Products Remote - Test</Title>
      
      <div style={{ marginBottom: '20px' }}>
        <Text strong>Toplam Ürün: </Text>
        <Text>{products?.length || 0}</Text>
        <br />
        
        <Text strong>Kategoriler: </Text>
        <Text>{categoriesLoading ? 'Yükleniyor...' : categories?.length || 0}</Text>
        <br />
        
        <Text strong>Sepetteki Ürün Sayısı: </Text>
        <Text>{getTotalItems()}</Text>
        <br />
        
        <Text strong>Toplam Tutar: </Text>
        <Text>${getTotalPrice().toFixed(2)}</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {products?.slice(0, 6).map(product => (
          <div key={product.id} style={{ 
            border: '1px solid #d9d9d9', 
            borderRadius: '8px', 
            padding: '16px',
            backgroundColor: 'white'
          }}>
            <img 
              src={product.image} 
              alt={product.title}
              style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '12px' }}
            />
            <Title level={4} style={{ marginBottom: '8px', fontSize: '16px' }}>
              {product.title.slice(0, 50)}...
            </Title>
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              ${product.price}
            </Text>
            <br />
            <Text type="secondary">
              ⭐ {product.rating.rate} ({product.rating.count})
            </Text>
            <br />
            <button 
              onClick={() => addToBasket(product)}
              style={{ 
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}