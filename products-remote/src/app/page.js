'use client'

import { Layout, Typography, Space, Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useProducts } from '@/hooks/useProducts'
import useProductStore from '@/store/useProductStore'
import ProductList from '@/components/ProductList'

import '@ant-design/v5-patch-for-react-19' 

const { Header, Content } = Layout
const { Title, Text } = Typography

export default function Home() {
  const {
    data: products,
    isLoading,
    error
  } = useProducts()

  const {
    getTotalItems,
    getFormattedTotalPrice
  } = useProductStore()

  const handleProductSelect = (product) => {
    console.log('Ürün seçildi:', product)
    // Burada ürün detay sayfasına yönlendirme yapabilirsin
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
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Products Remote
        </Title>

        <Space size="large">
          <Text type="secondary">
            Mikro Frontend E-ticaret
          </Text>

          {/* Basket Info */}
          <Badge count={getTotalItems()} showZero={false}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
            >
              {getFormattedTotalPrice()}
            </Button>
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
    </Layout>
  )
}