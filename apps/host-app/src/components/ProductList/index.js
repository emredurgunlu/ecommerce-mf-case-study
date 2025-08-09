import { Row, Col, Pagination, Empty, Spin, Typography, Alert } from 'antd'
import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'

const { Title } = Typography

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
  const [pageSize, setPageSize] = useState(12)

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return products.slice(startIndex, endIndex)
  }, [products, currentPage, pageSize])

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    if (size !== pageSize) {
      setPageSize(size)
    }
  }

  // Page size options
  const pageSizeOptions = ['12', '24', '36', '48']

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Title level={5}>Ürünler Yükleniyor...</Title>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Hata"
        description={`Ürünler yüklenirken bir hata oluştu: ${error.message}`}
        type="error"
        showIcon
      />
    )
  }

  // Empty state
  if (!products.length) {
    return <Empty description="Ürün bulunamadı" />
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedData.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <ProductCard 
              product={product} 
              onViewDetails={() => onProductSelect && onProductSelect(product)}
            />
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={products.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} ürün`}
        />
      </div>
    </div>
  )
}