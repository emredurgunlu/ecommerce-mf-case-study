import { Card, Button, Typography, Space, InputNumber, Image, App } from 'antd'
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { SUCCESS_MESSAGES } from '../../utils/constants'

const { Text, Title } = Typography

/**
 * BasketItem Component - Single Responsibility: Display basket item
 * 
 * @param {Object} item - Basket item data
 * @param {Function} onRemove - Callback for item removal
 * @param {Function} onUpdateQuantity - Callback for quantity update
 */
export default function BasketItem({ item, onRemove, onUpdateQuantity }) {
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Use App context for message
  const { message } = App.useApp()

  // Format price
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD'
  }).format(item.price)

  // Format total price
  const formattedTotalPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD'
  }).format(item.price * item.quantity)

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      onRemove(item.id)
      message.info(SUCCESS_MESSAGES.PRODUCT_REMOVED)
    } else {
      onUpdateQuantity(item.id, newQuantity)
      message.info(SUCCESS_MESSAGES.PRODUCT_UPDATED)
    }
  }

  return (
    <Card
      style={{ marginBottom: 16 }}
      styles={{
        body: { padding: 16 },
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Product Image */}
        <div style={{ flexShrink: 0, width: 80, height: 80, position: 'relative' }}>
          <Image
            alt={item.title}
            src={item.image}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: isImageLoading ? 'none' : 'block'
            }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            preview={false}
          />
          {isImageLoading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#ccc'
            }}>
              Yükleniyor...
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ marginBottom: 8 }}>
                {item.title}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Birim Fiyat: {formattedPrice}
              </Text>
            </div>

            {/* Price and Actions */}
            <div style={{ textAlign: 'right', minWidth: 120 }}>
              <Title level={5} style={{ color: '#1890ff', marginBottom: 8 }}>
                {formattedTotalPrice}
              </Title>

              <Space.Compact style={{ marginBottom: 8 }}>
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  size="small"
                  disabled={item.quantity <= 1}
                />
                <InputNumber
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  min={0}
                  max={99}
                  size="small"
                  style={{ width: 50, textAlign: 'center' }}
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  size="small"
                />
              </Space.Compact>

              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(item.id)}
                size="small"
                style={{ marginLeft: 8 }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}