'use client'

import { Layout, Typography, Menu, theme } from 'antd'
import { HomeOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

export default function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, marginRight: 24, color: '#1890ff' }}>
            E-Commerce MF
          </Title>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['home']}
            style={{ flex: 1, minWidth: 0, border: 'none' }}
            items={[
              {
                key: 'home',
                icon: <HomeOutlined />,
                label: 'Ana Sayfa',
              },
              {
                key: 'products',
                icon: <ShoppingOutlined />,
                label: 'Ürünler',
              },
              {
                key: 'basket',
                icon: <ShoppingCartOutlined />,
                label: 'Sepet',
              },
            ]}
          />
        </div>
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
          
          {/* Buraya remote uygulamalar eklenecek */}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        E-Commerce Micro Frontend ©{new Date().getFullYear()} Created with Turborepo
      </Footer>
    </Layout>
  )
}
