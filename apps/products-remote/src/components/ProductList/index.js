import { 
  Row, 
  Col, 
  Pagination, 
  Empty, 
  Spin, 
  Space, 
  Typography, 
  Button, 
  Dropdown,
  Switch,
  Alert
} from 'antd'
import { 
  AppstoreOutlined, 
  UnorderedListOutlined,
  SortAscendingOutlined,
  FilterOutlined
} from '@ant-design/icons'
import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import { useProductFilters, useFilterManager } from '@/hooks/useProductFilters'
import useProductStore from '@/store/useProductStore'
import { SORT_OPTIONS, GRID_CONFIG } from '@/utils/constants'

const { Title, Text } = Typography

/**
 * ProductList Component - Single Responsibility: Display and manage product list
 * 
 * @param {Array} products - Products array
 * @param {boolean} loading - Loading state
 * @param {Object} error - Error object
 * @param {Function} onProductSelect - Callback for product selection
 */
export default function ProductList({ 
  products = [], 
  loading = false, 
  error = null,
  onProductSelect 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const { 
    ui: { viewMode, pageSize },
    setViewMode,
    setPageSize 
  } = useProductStore()

  const {
    filters,
    updateSortBy,
    resetFilters,
    hasActiveFilters
  } = useFilterManager()

  const {
    products: filteredProducts,
    statistics,
    priceStatistics,
    isEmpty,
    isFiltered
  } = useProductFilters(products)

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage, pageSize])

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    if (size !== pageSize) {
      setPageSize(size)
    }
  }

  // Handle view mode change
  const handleViewModeChange = (checked) => {
    setViewMode(checked ? 'list' : 'grid')
  }

  // Sort dropdown items
  const sortItems = SORT_OPTIONS.map(option => ({
    key: option.key,
    label: option.label,
    onClick: () => updateSortBy(option.key)
  }))

  // Page size options
  const pageSizeOptions = ['12', '24', '36', '48']

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Ürünler yükleniyor...</Text>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Ürünler Yüklenemedi"
        description={error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload()
            }
          }}>
            Tekrar Dene
          </Button>
        }
        style={{ margin: '20px 0' }}
      />
    )
  }

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        padding: '16px 0',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Results Info */}
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Ürünler
          </Title>
          <Space size="middle">
            <Text type="secondary">
              {isFiltered ? (
                <>
                  <Text strong>{filteredProducts.length}</Text> ürün bulundu
                  <Text type="secondary"> (toplam {statistics.totalProducts})</Text>
                </>
              ) : (
                <>
                  <Text strong>{statistics.totalProducts}</Text> ürün
                </>
              )}
            </Text>
            
            {hasActiveFilters && (
              <Button 
                type="link" 
                size="small"
                icon={<FilterOutlined />}
                onClick={resetFilters}
              >
                Filtreleri Temizle
              </Button>
            )}
          </Space>
        </div>

        {/* Controls */}
        <Space size="middle">
          {/* Sort Dropdown */}
          <Dropdown 
            menu={{ items: sortItems, selectedKeys: [filters.sortBy] }}
            trigger={['click']}
          >
            <Button icon={<SortAscendingOutlined />}>
              Sırala
            </Button>
          </Dropdown>

          {/* View Mode Switch */}
          <Space size="small">
            <AppstoreOutlined style={{ color: !viewMode || viewMode === 'grid' ? '#1890ff' : '#ccc' }} />
            <Switch
              checked={viewMode === 'list'}
              onChange={handleViewModeChange}
              size="small"
            />
            <UnorderedListOutlined style={{ color: viewMode === 'list' ? '#1890ff' : '#ccc' }} />
          </Space>
        </Space>
      </div>

      {/* Statistics Bar */}
      {isFiltered && (
        <Alert
          message={
            <Space size="large">
              <Text>
                <Text strong>Fiyat Aralığı:</Text> ${priceStatistics.min} - ${priceStatistics.max}
              </Text>
              <Text>
                <Text strong>Ortalama Fiyat:</Text> ${priceStatistics.average}
              </Text>
            </Space>
          }
          type="info"
          style={{ marginBottom: 16 }}
          showIcon={false}
        />
      )}

      {/* Products Grid/List */}
      {isEmpty ? (
        <Empty
          description={
            hasActiveFilters 
              ? "Filtrelere uygun ürün bulunamadı"
              : "Henüz ürün yok"
          }
          style={{ padding: '50px 0' }}
        >
          {hasActiveFilters && (
            <Button type="primary" onClick={resetFilters}>
              Tüm Ürünleri Göster
            </Button>
          )}
        </Empty>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Row gutter={GRID_CONFIG.GUTTER}>
              {paginatedData.map(product => (
                // Ant Design'ın grid sistemi 24 sütunludur. Yani:
                // xs={24} → Mobil cihazlarda (ekran < 576px) ürün tüm satırı kaplar (1 ürün/satır).
                // sm={12} → Küçük ekranlarda (≥576px) 12 sütun kaplar → 2 ürün/satır.
                // md={8} → Orta ekranlarda (≥768px) 8 sütun kaplar → 3 ürün/satır.
                // lg={6} → Büyük ekranlarda (≥992px) 6 sütun kaplar → 4 ürün/satır.
                // xl={6} → Daha büyük ekranlarda (≥1200px) yine 4 ürün/satır.
                // xxl={6} → Ekstra büyük ekranlarda (≥1600px) 4 sütun kaplar → 6 ürün/satır.
                <Col
                  key={product.id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={6}
                  xxl={6}
                  style={{ marginBottom: 16 }}
                >
                  <ProductCard
                    product={product}
                    viewMode="grid"
                    onViewDetails={onProductSelect}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              {paginatedData.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="list"
                  onViewDetails={onProductSelect}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > pageSize && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: 32,
              padding: '24px 0',
              borderTop: '1px solid #f0f0f0'
            }}>
              <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={pageSizeOptions}
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} / ${total} ürün`
                }
                style={{ marginBottom: 16 }}
              />
              
              {/* Page Info */}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Sayfa {currentPage} / {Math.ceil(filteredProducts.length / pageSize)}
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  )
}