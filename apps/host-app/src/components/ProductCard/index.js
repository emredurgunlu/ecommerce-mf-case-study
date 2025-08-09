import { Card, Button, Typography, Tag, Space, App } from 'antd'
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useBasketIntegration } from '@/hooks/useBasketIntegration'
import useProductStore from '@/store/useProductStore'
import { SUCCESS_MESSAGES } from '@/utils/constants'

const { Title, Text, Paragraph } = Typography

/**
 * ProductCard Component - Single Responsibility: Display product information
 * 
 * @param {Object} product - Product data
 * @param {Function} onViewDetails - Callback for view details
 */
export default function ProductCard({ product, onViewDetails }) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { addToBasket: addToBasketRemote } = useBasketIntegration()
  const { addToBasket: addToBasketLocal } = useProductStore()
  
  // Use App context for message
  const { message } = App.useApp()

  // Format price
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD'
  }).format(product.price)

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'electronics': 'blue',
      'jewelery': 'gold',
      "men's clothing": 'green',
      "women's clothing": 'pink'
    }
    return colors[category] || 'default'
  }

  // Handle add to basket
  const handleAddToBasket = () => {
    // Hem local store'a hem de remote'a ekle
    addToBasketLocal(product)
    addToBasketRemote(product)
    
    // Debug için console.log ekleyelim
    console.log('Ürün sepete eklendi:', product.title)
    console.log('Local store güncellendi')
    
    message.success(SUCCESS_MESSAGES.PRODUCT_ADDED)
  }

  // Truncate text utility
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  return (
    <Card
      hoverable
      cover={
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
          {isImageLoading && (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>Yükleniyor...</span>
            </div>
          )}
          <img
            alt={product.title}
            src={product.image}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              display: isImageLoading ? 'none' : 'block'
            }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>
      }
      actions={[
        <Button 
          key="add" 
          type="primary" 
          icon={<ShoppingCartOutlined />} 
          onClick={handleAddToBasket}
        >
          Sepete Ekle
        </Button>,
        <Button 
          key="view" 
          icon={<EyeOutlined />} 
          onClick={() => onViewDetails && onViewDetails(product)}
        >
          Detaylar
        </Button>
      ]}
    >
      <Tag color={getCategoryColor(product.category)} style={{ marginBottom: 8 }}>
        {product.category}
      </Tag>
      <Title level={5} style={{ marginTop: 0, height: 48, overflow: 'hidden' }}>
        {truncateText(product.title, 50)}
      </Title>
      <Paragraph style={{ height: 60, overflow: 'hidden' }}>
        {truncateText(product.description, 100)}
      </Paragraph>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
          {formattedPrice}
        </Text>
        <Space>
          <Text>Rating: {product.rating?.rate || 0}/5</Text>
        </Space>
      </div>
    </Card>
  )
}