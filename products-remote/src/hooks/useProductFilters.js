import { useMemo } from 'react'
import { productService } from '@/services/productService'
import useProductStore from '@/store/useProductStore'

/**
 * Custom hook for filtering and sorting products
 * Single Responsibility: Handles product filtering and sorting logic
 * 
 * @param {Array} products - Raw products array
 * @returns {Object} - Filtered and sorted products with utilities
 */
export const useProductFilters = (products = []) => {
  const { filters } = useProductStore()

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!products.length) return []
    
    // Apply filters
    let filtered = productService.filterProducts(products, filters)
    
    // Apply sorting
    filtered = productService.sortProducts(filtered, filters.sortBy)
    
    return filtered
  }, [products, filters])

  // Memoized statistics
  const statistics = useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        filteredCount: 0,
        priceRange: { min: 0, max: 0 },
        categories: []
      }
    }

    const prices = products.map(p => p.price)
    const categories = [...new Set(products.map(p => p.category))]

    return {
      totalProducts: products.length,
      filteredCount: filteredProducts.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      categories: categories.sort()
    }
  }, [products, filteredProducts])

  // Search functionality
  const searchProducts = useMemo(() => {
    return (searchTerm) => {
      if (!searchTerm || searchTerm.trim() === '') {
        return filteredProducts
      }

      const term = searchTerm.toLowerCase().trim()
      
      return filteredProducts.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    }
  }, [filteredProducts])

  // Pagination utilities
  const getPaginatedProducts = useMemo(() => {
    return (page = 1, pageSize = 12) => {
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      
      return {
        data: filteredProducts.slice(startIndex, endIndex),
        pagination: {
          current: page,
          pageSize,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / pageSize)
        }
      }
    }
  }, [filteredProducts])

  // Category distribution
  const categoryDistribution = useMemo(() => {
    const distribution = {}
    
    filteredProducts.forEach(product => {
      distribution[product.category] = (distribution[product.category] || 0) + 1
    })
    
    return Object.entries(distribution).map(([category, count]) => ({
      category,
      count,
      percentage: ((count / filteredProducts.length) * 100).toFixed(1)
    }))
  }, [filteredProducts])

  // Price statistics
  const priceStatistics = useMemo(() => {
    if (!filteredProducts.length) {
      return { min: 0, max: 0, average: 0, median: 0 }
    }

    const prices = filteredProducts.map(p => p.price).sort((a, b) => a - b)
    const total = prices.reduce((sum, price) => sum + price, 0)
    const average = total / prices.length
    const median = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)]

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: parseFloat(average.toFixed(2)),
      median: parseFloat(median.toFixed(2))
    }
  }, [filteredProducts])

  return {
    // Data
    products: filteredProducts,
    originalProducts: products,
    
    // Statistics
    statistics,
    priceStatistics,
    categoryDistribution,
    
    // Utilities
    searchProducts,
    getPaginatedProducts,
    
    // State
    isFiltered: filteredProducts.length !== products.length,
    isEmpty: filteredProducts.length === 0,
    hasProducts: products.length > 0
  }
}

/**
 * Custom hook for managing filter state
 * Separates filter management from filtering logic (SRP)
 */
export const useFilterManager = () => {
  const { filters, setFilters } = useProductStore()

  const updateCategory = (category) => {
    setFilters({ category })
  }

  const updateSortBy = (sortBy) => {
    setFilters({ sortBy })
  }

  const updatePriceRange = (priceRange) => {
    setFilters({ priceRange })
  }

  const resetFilters = () => {
    setFilters({
      category: 'all',
      sortBy: 'default',
      priceRange: [0, 1000]
    })
  }

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.sortBy !== 'default' || 
           (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000)
  }

  return {
    filters,
    updateCategory,
    updateSortBy,
    updatePriceRange,
    resetFilters,
    hasActiveFilters: hasActiveFilters()
  }
}