import {
    Card,
    Button,
    Typography,
    Rate,
    Tag,
    Space,
    InputNumber,
    Tooltip,
    App
} from 'antd'
import {
    ShoppingCartOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    PlusOutlined,
    MinusOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import useProductStore from '@/store/useProductStore'
import { SUCCESS_MESSAGES } from '@/utils/constants'

const { Title, Text, Paragraph } = Typography

/**
 * ProductCard Component - Single Responsibility: Display product information
 * 
 * @param {Object} product - Product data
 * @param {string} viewMode - 'grid' | 'list'
 * @param {Function} onViewDetails - Callback for view details
 * @param {boolean} showAddToCart - Show add to cart button
 */
export default function ProductCard({
    product,
    viewMode = 'grid',
    onViewDetails,
    showAddToCart = true
}) {
    const [isImageLoading, setIsImageLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)

    // Use App context for message
    const { message } = App.useApp()

    const {
        addToBasket,
        updateQuantity,
        removeFromBasket,
        isProductInBasket,
        getProductQuantityInBasket
    } = useProductStore()

    const isInBasket = isProductInBasket(product.id)
    const quantityInBasket = getProductQuantityInBasket(product.id)

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
        addToBasket(product)
        message.success(SUCCESS_MESSAGES.PRODUCT_ADDED)
    }

    // Handle quantity change
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity === 0) {
            removeFromBasket(product.id)
            message.info(SUCCESS_MESSAGES.PRODUCT_REMOVED)
        } else {
            updateQuantity(product.id, newQuantity)
            message.info(SUCCESS_MESSAGES.PRODUCT_UPDATED)
        }
    }

    // Handle favorite toggle
    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite)
        message.info(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
    }

    // Truncate text utility
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }

    // Common action buttons
    const ActionButtons = () => (
        <Space size="small">
            {onViewDetails && (
                <Tooltip title="Detayları Gör">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => onViewDetails(product)}
                        size="small"
                    />
                </Tooltip>
            )}

            <Tooltip title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}>
                <Button
                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleFavoriteToggle}
                    size="small"
                    type={isFavorite ? 'primary' : 'default'}
                    danger={isFavorite}
                />
            </Tooltip>
        </Space>
    )

    // Quantity Controls
    const QuantityControls = () => (
        <Space.Compact>
            <Button
                icon={<MinusOutlined />}
                onClick={() => handleQuantityChange(quantityInBasket - 1)}
                size="small"
                disabled={quantityInBasket < 1}
            />
            <InputNumber
                value={quantityInBasket}
                onChange={handleQuantityChange}
                min={0}
                max={99}
                size="small"
                style={{ width: 60, textAlign: 'center' }}
            />
            <Button
                icon={<PlusOutlined />}
                onClick={() => handleQuantityChange(quantityInBasket + 1)}
                size="small"
            />
        </Space.Compact>
    )

    // Grid view (default)
    if (viewMode === 'grid') {
        return (
            <Card
                hoverable
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                styles={{
                    body: { flex: 1, display: 'flex', flexDirection: 'column' },
                }}
                cover={
                    <div style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
                        <img
                            alt={product.title}
                            src={product.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '10px',
                                display: isImageLoading ? 'none' : 'block'
                            }}
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => setIsImageLoading(false)}
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

                        {/* Category Tag */}
                        <Tag
                            color={getCategoryColor(product.category)}
                            style={{ position: 'absolute', top: 8, left: 8 }}
                        >
                            {product.category}
                        </Tag>
                    </div>
                }
                actions={[
                    <ActionButtons key="actions" />
                ]}
            >
                <div style={{ flex: 1 }}>
                    <Tooltip title={product.title}>
                        <Title level={5} style={{ marginBottom: 8, height: 44, overflow: 'hidden' }}>
                            {truncateText(product.title, 50)}
                        </Title>
                    </Tooltip>

                    <Paragraph
                        type="secondary"
                        style={{
                            fontSize: '12px',
                            marginBottom: 12,
                            height: 36,
                            overflow: 'hidden'
                        }}
                    >
                        {truncateText(product.description, 80)}
                    </Paragraph>

                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        {/* Rating */}
                        <Space size="small">
                            <Rate disabled defaultValue={product.rating.rate} allowHalf size="small" />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                ({product.rating.count})
                            </Text>
                        </Space>

                        {/* Price */}
                        <Title level={4} style={{ color: '#1890ff', marginBottom: 0 }}>
                            {formattedPrice}
                        </Title>
                    </Space>
                </div>

                {/* Add to Cart Section */}
                {showAddToCart && (
                    <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                        {!isInBasket ? (
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToBasket}
                                block
                            >
                                Sepete Ekle
                            </Button>
                        ) : (
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Text strong style={{ color: '#52c41a' }}>Sepette</Text>
                                <QuantityControls />
                            </Space>
                        )}
                    </div>
                )}
            </Card>
        )
    }

    // List view
    if (viewMode === 'list') {
        return (
            <Card
                style={{ marginBottom: 16 }}
                styles={{
                    body: {
                        padding: 16,
                    },
                }}
            >
                <div style={{ display: 'flex', gap: 16 }}>
                    {/* Product Image */}
                    <div style={{ flexShrink: 0, width: 120, height: 120, position: 'relative' }}>
                        <img
                            alt={product.title}
                            src={product.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: isImageLoading ? 'none' : 'block'
                            }}
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => setIsImageLoading(false)}
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
                                <Space size="small" style={{ marginBottom: 8 }}>
                                    <Tag color={getCategoryColor(product.category)}>
                                        {product.category}
                                    </Tag>
                                </Space>

                                <Title level={4} style={{ marginBottom: 8 }}>
                                    {product.title}
                                </Title>

                                <Paragraph
                                    type="secondary"
                                    style={{ marginBottom: 12 }}
                                >
                                    {truncateText(product.description, 150)}
                                </Paragraph>

                                <Space size="middle">
                                    <Rate disabled defaultValue={product.rating.rate} allowHalf size="small" />
                                    <Text type="secondary">
                                        ({product.rating.count} değerlendirme)
                                    </Text>
                                </Space>
                            </div>

                            {/* Price and Actions */}
                            <div style={{ textAlign: 'right', minWidth: 200 }}>
                                <Title level={3} style={{ color: '#1890ff', marginBottom: 16 }}>
                                    {formattedPrice}
                                </Title>

                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <ActionButtons />

                                    {showAddToCart && (
                                        <>
                                            {!isInBasket ? (
                                                <Button
                                                    type="primary"
                                                    icon={<ShoppingCartOutlined />}
                                                    onClick={handleAddToBasket}
                                                    style={{ width: '100%' }}
                                                >
                                                    Sepete Ekle
                                                </Button>
                                            ) : (
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Text strong style={{ color: '#52c41a' }}>Sepette</Text>
                                                    <QuantityControls />
                                                </Space>
                                            )}
                                        </>
                                    )}
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    return null
}