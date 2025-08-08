import { useQuery } from '@tanstack/react-query'
import { productService, handleApiError } from '@/services/productService'
import { QUERY_KEYS } from '@/utils/constants'

/**
 * Custom hook for fetching all products
 * Single Responsibility: Only handles product data fetching
 */
export const useProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: productService.getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Data transformation - ensure consistent structure
      return data?.map(product => ({
        ...product,
        // Normalize price to number
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        // Ensure rating structure
        rating: product.rating || { rate: 0, count: 0 }
      })) || []
    },
    onError: (error) => {
      console.error('Products fetch error:', handleApiError(error))
    }
  })
}

/**
 * Custom hook for fetching single product
 * @param {string|number} productId - Product ID
 */
export const useProduct = (productId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => productService.getProduct(productId),
    enabled: !!productId, // Only fetch if productId exists
    staleTime: 10 * 60 * 1000, // 10 minutes for single product
    select: (data) => {
      if (!data) return null
      
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        rating: data.rating || { rate: 0, count: 0 }
      }
    },
    onError: (error) => {
      console.error(`Product ${productId} fetch error:`, handleApiError(error))
    }
  })
}

/**
 * Custom hook for fetching products by category
 * @param {string} category - Product category
 */
export const useProductsByCategory = (category) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY, category],
    queryFn: () => productService.getProductsByCategory(category),
    enabled: !!category && category !== 'all',
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      return data?.map(product => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        rating: product.rating || { rate: 0, count: 0 }
      })) || []
    },
    onError: (error) => {
      console.error(`Products by category ${category} fetch error:`, handleApiError(error))
    }
  })
}

/**
 * Custom hook for fetching categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: productService.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    select: (data) => {
      // Transform categories to match our format
      return data?.map(category => ({
        key: category,
        label: getCategoryLabel(category)
      })) || []
    },
    onError: (error) => {
      console.error('Categories fetch error:', handleApiError(error))
    }
  })
}

/**
 * Helper function to get localized category labels
 * @param {string} category - Category key
 * @returns {string} - Localized label
 */
const getCategoryLabel = (category) => {
  const categoryLabels = {
    'electronics': 'Elektronik',
    'jewelery': 'Mücevher',
    "men's clothing": 'Erkek Giyim',
    "women's clothing": 'Kadın Giyim'
  }
  
  return categoryLabels[category] || category
}