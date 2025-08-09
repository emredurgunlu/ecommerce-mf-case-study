'use client'

import { useState, useEffect } from 'react'
import { Layout, Typography, Breadcrumb, theme, Space, Button, Badge } from 'antd'
import { HomeOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import ProductList from '@/components/ProductList'
import RemoteWrapper from '@/components/RemoteWrapper'
import { REMOTE_APPS } from '@/utils/constants'
import useProductStore from '@/store/useProductStore'
import { useBasketIntegration } from '@/hooks/useBasketIntegration'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

// Statik yıl değeri - hydration hatasını önlemek için
const CURRENT_YEAR = 2024

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [selectedKey, setSelectedKey] = useState('home')
  // Client-side state for basket count to prevent hydration mismatch
  const [basketCount, setBasketCount] = useState(0)

  const { data: products, isLoading, error } = useRemoteProducts()

  const {
    getTotalItems,
    selectedProducts,
  } = useProductStore()

  // Update basket count after component mounts (client-side only)
  useEffect(() => {
    const newBasketCount = getTotalItems()
    console.log('Basket count güncellendi:', newBasketCount)
    console.log('Selected products:', selectedProducts)
    setBasketCount(newBasketCount)
  }, [getTotalItems, selectedProducts])

  // Sayfa yönlendirme fonksiyonları
  const navigateToHome = () => {
    setSelectedKey('home')
    // Ana sayfa zaten bu sayfa olduğu için yönlendirme yapmıyoruz
  }

  const navigateToProducts = () => {
    setSelectedKey('products')
    // Products remote uygulamasına yönlendirme
    window.open(REMOTE_APPS.PRODUCTS.URL, '_blank')
  }

  const navigateToBasket = () => {
    setSelectedKey('basket')
    // Basket remote uygulamasına yönlendirme
    window.open(REMOTE_APPS.BASKET.URL, '_blank')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, marginRight: 24, color: '#1890ff' }}>
            E-Commerce MF
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
        
        {/* Sepet Butonu - Sadece ikon ve badge */}
        <Space size="large">
          <Text type="secondary">
            Mikro Frontend E-ticaret
          </Text>
          
          <Badge count={basketCount} showZero={false}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={navigateToBasket}
            />
          </Badge>
        </Space>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        {/* Product List Section */}
        <div style={{ maxWidth: 1200, margin: '32px auto 0', padding: 0 }}>
          <ProductList 
            products={products} 
            loading={isLoading} 
            error={error} 
            onProductSelect={(product) => console.log('Ürün seçildi:', product)}
          />
        </div>
        
        {/* Basket Remote Section - Gizli iframe */}
        <div style={{ display: 'none' }}>
          <RemoteWrapper
            url={REMOTE_APPS.BASKET.URL}
            name={REMOTE_APPS.BASKET.NAME}
          >
            <iframe 
              src={REMOTE_APPS.BASKET.URL} 
              title="Basket Remote" 
              style={{ width: '100%', height: '0', border: 'none' }}
            />
          </RemoteWrapper>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        E-Commerce Micro Frontend ©{CURRENT_YEAR} Created with Turborepo
      </Footer>
    </Layout>
  )
}
