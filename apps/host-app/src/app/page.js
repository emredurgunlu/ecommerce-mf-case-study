'use client'

import { useState, useEffect } from 'react'
import { Layout, Typography, Breadcrumb, theme, Space, Button, Badge, Grid, Drawer } from 'antd'
import { HomeOutlined, ShoppingOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import ProductList from '@/components/ProductList'
import RemoteWrapper from '@/components/RemoteWrapper'
import { REMOTE_APPS } from '@/utils/constants'
import useProductStore from '@/store/useProductStore'
import { useBasketIntegration } from '@/hooks/useBasketIntegration'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography
const { useBreakpoint } = Grid

// Statik yıl değeri - hydration hatasını önlemek için
const CURRENT_YEAR = 2024

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const screens = useBreakpoint()
  const [selectedKey, setSelectedKey] = useState('home')
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Client-side state for basket count to prevent hydration mismatch
  const [basketCount, setBasketCount] = useState(0)

  const { data: products, isLoading, error } = useRemoteProducts()

  const {
    getTotalItems,
    selectedProducts,
  } = useProductStore()

  const isMobile = !screens.md

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
    setDrawerOpen(false)
    // Ana sayfa zaten bu sayfa olduğu için yönlendirme yapmıyoruz
  }

  const navigateToProducts = () => {
    setSelectedKey('products')
    setDrawerOpen(false)
    // Products remote uygulamasına yönlendirme
    window.open(REMOTE_APPS.PRODUCTS.URL, '_blank')
  }

  const navigateToBasket = () => {
    setSelectedKey('basket')
    setDrawerOpen(false)
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
        padding: '0 16px'
      }}>
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={isMobile ? 5 : 3} style={{ margin: 0, marginRight: isMobile ? 8 : 24, color: '#1890ff' }}>
            {isMobile ? 'E-Commerce' : 'E-Commerce MF'}
          </Title>
          
          {!isMobile && (
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
          )}
        </div>
        
        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {!isMobile ? (
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
          ) : (
            <>
              <Badge count={basketCount} showZero={false}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="middle"
                  onClick={navigateToBasket}
                />
              </Badge>

              <Button
                icon={<MenuOutlined />}
                size="middle"
                onClick={() => setDrawerOpen(true)}
              />
            </>
          )}
        </div>

        {/* Drawer for Mobile Menu */}
        <Drawer
          title="Menü"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <a onClick={navigateToHome}>
              <HomeOutlined /> Ana Sayfa
            </a>
            <a onClick={navigateToProducts}>
              <ShoppingOutlined /> Ürünler
            </a>
            <Text type="secondary">Mikro Frontend E-ticaret</Text>
          </Space>
        </Drawer>
      </Header>
      
      <Content style={{ padding: isMobile ? '16px' : '24px' }}>
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
