import { Layout, Typography } from 'antd'
import AntdProvider from './providers/AntdProvider'
import BasketList from './components/BasketList'
import { useBasket } from './hooks/useBasket'
import '@ant-design/v5-patch-for-react-19'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  const {
    basketItems,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    getTotalPrice,
    getFormattedTotalPrice
  } = useBasket()

  return (
    <AntdProvider>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header style={{
          backgroundColor: 'white',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Basket Remote
          </Title>
        </Header>

        <Content style={{ padding: '24px' }}>
          <div style={{
            maxWidth: 800,
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <BasketList
              items={basketItems}
              onRemove={removeFromBasket}
              onUpdateQuantity={updateQuantity}
              onClear={clearBasket}
              getTotalPrice={getTotalPrice}
              getFormattedTotalPrice={getFormattedTotalPrice}
            />
          </div>
        </Content>
      </Layout>
    </AntdProvider>
  )
}

export default App
