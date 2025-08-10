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

const CURRENT_YEAR = 2024

// Environment-based URLs
const getAppUrls = () => {
  if (typeof window === 'undefined') return {}
  
  const isProduction = window.location.hostname !== 'localhost'
  
  return {
    PRODUCTS_URL: isProduction ? process.env.NEXT_PUBLIC_PRODUCTS_URL || 'https://your-products-app.vercel.app' : REMOTE_APPS.PRODUCTS.URL,
    BASKET_URL: isProduction ? process.env.NEXT_PUBLIC_BASKET_URL || 'https://your-basket-app.vercel.app' : REMOTE_APPS.BASKET.URL
  }
}

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const screens = useBreakpoint()
  const [selectedKey, setSelectedKey] = useState('home')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [basketCount, setBasketCount] = useState(0)
  const [appUrls, setAppUrls] = useState({})

  const { data: products, isLoading, error } = useRemoteProducts()

  const {
    getTotalItems,
    selectedProducts,
  } = useProductStore()

  const { basketIframeRef } = useBasketIntegration()

  const isMobile = !screens.md

  // Initialize URLs on client side
  useEffect(() => {
    setAppUrls(getAppUrls())
  }, [])

  useEffect(() => {
    const newBasketCount = getTotalItems()
    console.log('Basket count güncellendi:', newBasketCount)
    console.log('Selected products:', selectedProducts)
    setBasketCount(newBasketCount)
  }, [getTotalItems, selectedProducts])

  const navigateToHome = () => {
    setSelectedKey('home')
    setDrawerOpen(false)
  }

  const navigateToProducts = () => {
    setSelectedKey('products')
    setDrawerOpen(false)
    if (typeof window !== 'undefined' && appUrls.PRODUCTS_URL) {
      window.open(appUrls.PRODUCTS_URL, '_blank')
    }
  }

  const navigateToBasket = () => {
    setSelectedKey('basket')
    setDrawerOpen(false)
    if (typeof window !== 'undefined' && appUrls.BASKET_URL) {
      window.open(appUrls.BASKET_URL, '_blank')
    }
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
              ref={basketIframeRef}
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
