import { List, Empty, Typography, Button, Divider, Space, App } from 'antd'
import { ShoppingOutlined, DeleteOutlined } from '@ant-design/icons'
import BasketItem from '../BasketItem'
import { SUCCESS_MESSAGES } from '../../utils/constants'

const { Title, Text } = Typography

/**
 * BasketList Component - Single Responsibility: Display basket items list
 * 
 * @param {Array} items - Basket items
 * @param {Function} onRemove - Callback for item removal
 * @param {Function} onUpdateQuantity - Callback for quantity update
 * @param {Function} onClear - Callback for clearing basket
 * @param {Function} getTotalPrice - Function to get total price
 * @param {Function} getFormattedTotalPrice - Function to get formatted total price
 */
export default function BasketList({
  items = [],
  onRemove,
  onUpdateQuantity,
  onClear,
  getTotalPrice,
  getFormattedTotalPrice
}) {
  const { message } = App.useApp()

  const handleClearBasket = () => {
    onClear()
    message.success(SUCCESS_MESSAGES.BASKET_CLEARED)
  }

  if (!items.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Sepetinizde ürün bulunmamaktadır"
      >
        <Button 
          type="primary" 
          icon={<ShoppingOutlined />}
        >
          Alışverişe Başla
        </Button>
      </Empty>
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <Title level={4} style={{ margin: 0 }}>
          Sepetim ({items.length} ürün)
        </Title>
        <Button 
          danger 
          icon={<DeleteOutlined />} 
          onClick={handleClearBasket}
        >
          Sepeti Temizle
        </Button>
      </div>

      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item style={{ padding: 0, border: 'none' }}>
            <BasketItem
              item={item}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          </List.Item>
        )}
      />

      <Divider />

      <div style={{ textAlign: 'right' }}>
        <Space direction="vertical" size="small" align="end">
          <Text>Toplam Tutar:</Text>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            {getFormattedTotalPrice()}
          </Title>
          <Button type="primary" size="large">
            Siparişi Tamamla
          </Button>
        </Space>
      </div>
    </div>
  )
}