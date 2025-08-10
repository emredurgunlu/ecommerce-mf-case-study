'use client'

import { Layout, Typography, Space, Badge, Button, Breadcrumb, Grid, Drawer } from 'antd'
import { ShoppingCartOutlined, HomeOutlined, ShoppingOutlined, MenuOutlined } from '@ant-design/icons'
import { useProducts } from '@/hooks/useProducts'
import useProductStore from '@/store/useProductStore'
import ProductList from '@/components/ProductList'
import { REMOTE_APPS } from '@/utils/constants'
import { useState, useEffect } from 'react'

import '@ant-design/v5-patch-for-react-19' 

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography
const { useBreakpoint } = Grid

// Statik yıl değeri - hydration hatasını önlemek için
const CURRENT_YEAR = 2024

// Environment-based URLs
const getAppUrls = () => {
  if (typeof window === 'undefined') return {}
  
  const isProduction = window.location.hostname !== 'localhost'
  
  return {
    HOST_URL: isProduction ? process.env.NEXT_PUBLIC_HOST_URL || 'https://your-host-app.vercel.app' : 'http://localhost:3000',
    BASKET_URL: isProduction ? process.env.NEXT_PUBLIC_BASKET_URL || 'https://your-basket-app.vercel.app' : 'http://localhost:3002'
  }
}

export default function Home() {
  const screens = useBreakpoint()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [basketCount, setBasketCount] = useState(0)
  const [appUrls, setAppUrls] = useState({})
  
  const {
    data: products,
    isLoading,
    error
  } = useProducts()

  const {
    getTotalItems,
    selectedProducts,
  } = useProductStore()

  const isMobile = !screens.md

  // Initialize URLs on client side
  useEffect(() => {
    setAppUrls(getAppUrls())
  }, [])

  useEffect(() => {
    setBasketCount(getTotalItems())
  }, [getTotalItems, selectedProducts])

  const handleProductSelect = (product) => {
    console.log('Ürün seçildi:', product)
  }

  // Sayfa yönlendirme fonksiyonları
  const navigateToHome = () => {
    setDrawerOpen(false)
    if (typeof window !== 'undefined' && appUrls.HOST_URL) {
      window.open(appUrls.HOST_URL, '_blank')
    }
  }

  const navigateToProducts = () => {
    setDrawerOpen(false)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const navigateToBasket = () => {
    setDrawerOpen(false)
    if (typeof window !== 'undefined' && appUrls.BASKET_URL) {
      window.open(appUrls.BASKET_URL, '_blank')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{
        backgroundColor: 'white',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={isMobile ? 5 : 3} style={{ margin: 0, marginRight: isMobile ? 8 : 24, color: '#1890ff' }}>
            {isMobile ? 'Products' : 'Products Remote'}
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

      {/* Content */}
      <Content style={{ padding: isMobile ? '16px' : '24px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: isMobile ? '16px' : '24px',
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