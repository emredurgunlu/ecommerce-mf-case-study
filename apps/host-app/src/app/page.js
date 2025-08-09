'use client'

import { useState } from 'react'
import { Layout, Typography, Breadcrumb, theme, Space, Button, Badge } from 'antd'
import { HomeOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import ProductList from '@/components/ProductList'
import RemoteWrapper from '@/components/RemoteWrapper'
import { REMOTE_APPS } from '@/utils/constants'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const [selectedKey, setSelectedKey] = useState('home')

  const { data: products, isLoading, error } = useRemoteProducts()

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
        
        {/* Sepet Butonu - Sağda */}
        <Space size="large">
          <Text type="secondary">
            Mikro Frontend E-ticaret
          </Text>
          
          <Badge count={0} showZero={false}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={navigateToBasket}
            >
              Sepet
            </Button>
          </Badge>
        </Space>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Title level={2}>Mikro Frontend E-Ticaret Uygulaması</Title>
          <Text>Bu uygulama, Turborepo ve monorepo yapısı kullanılarak geliştirilmiş bir mikro frontend e-ticaret uygulamasıdır.</Text>
        </div>
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
        E-Commerce Micro Frontend ©{new Date().getFullYear()} Created with Turborepo
      </Footer>
    </Layout>
  )
}
