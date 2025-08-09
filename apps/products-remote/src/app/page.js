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

export default function Home() {
  const screens = useBreakpoint()
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  const isMobile = !screens.md

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
    setDrawerOpen(false)
    // Ana sayfaya yönlendirme
    window.open('http://localhost:3000', '_blank')
  }

  const navigateToProducts = () => {
    setDrawerOpen(false)
    // Products remote uygulaması zaten bu sayfa olduğu için yönlendirme yapmıyoruz
    // veya sayfayı yenileyebiliriz
    window.location.reload()
  }

  const navigateToBasket = () => {
    setDrawerOpen(false)
    window.open('http://localhost:3002', '_blank')
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