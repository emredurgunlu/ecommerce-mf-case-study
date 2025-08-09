'use client'

import { Layout, Typography, Space, Badge, Button, Breadcrumb } from 'antd'
import { ShoppingCartOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useProducts } from '@/hooks/useProducts'
import useProductStore from '@/store/useProductStore'
import ProductList from '@/components/ProductList'
import { REMOTE_APPS } from '@/utils/constants'
import { useState, useEffect } from 'react'

import '@ant-design/v5-patch-for-react-19' 

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

// Statik yıl değeri - hydration hatasını önlemek için
const CURRENT_YEAR = 2024

export default function Home() {
  // Client-side state for basket count to prevent hydration mismatch
  const [basketCount, setBasketCount] = useState(0)
  
  const {
    data: products,
    isLoading,
    error
  } = useProducts()

  const {
    getTotalItems,
    selectedProducts, // Sepetteki ürünleri doğrudan izlemek için
  } = useProductStore()

  // Update basket count after component mounts (client-side only)
  // selectedProducts'ı bağımlılık dizisine ekleyerek sepet değişikliklerini izliyoruz
  useEffect(() => {
    setBasketCount(getTotalItems())
  }, [getTotalItems, selectedProducts]) // selectedProducts'ı izleyerek sepet değişikliklerini yakalıyoruz

  const handleProductSelect = (product) => {
    console.log('Ürün seçildi:', product)
    // Burada ürün detay sayfasına yönlendirme yapabilirsin
  }

  // Sayfa yönlendirme fonksiyonları
  const navigateToHome = () => {
    // Ana sayfaya yönlendirme
    window.open('http://localhost:3000', '_blank')
  }

  const navigateToProducts = () => {
    // Products remote uygulaması zaten bu sayfa olduğu için yönlendirme yapmıyoruz
    // veya sayfayı yenileyebiliriz
    window.location.reload()
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{
        backgroundColor: 'white',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, marginRight: 24, color: '#1890ff' }}>
            Products Remote
          </Title>

          {/* Breadcrumb Menü */}
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={navigateToHome}>
                    <HomeOutlined /> Ana Sayfa
                  </a>
                ),
              },
              {
                title: (
                  <a onClick={navigateToProducts}>
                    <ShoppingOutlined /> Ürünler
                  </a>
                ),
              },
            ]}
          />
        </div>

        <Space size="large">
          <Text type="secondary">
            Mikro Frontend E-ticaret
          </Text>

          {/* Basket Info - Sadece ikon ve badge */}
          <Badge count={basketCount} showZero={false}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={() => window.open('http://localhost:3002', '_blank')}
            />
          </Badge>
        </Space>
      </Header>

      {/* Content */}
      <Content style={{ padding: '24px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <ProductList
            products={products}
            loading={isLoading}
            error={error}
            onProductSelect={handleProductSelect}
          />
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        Products Remote ©{CURRENT_YEAR} Created with Next.js
      </Footer>
    </Layout>
  )
}