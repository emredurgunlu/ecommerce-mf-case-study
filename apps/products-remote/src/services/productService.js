import { API_CONFIG, ERROR_MESSAGES } from '@/utils/constants'

// Base API configuration
const API_BASE_URL = API_CONFIG.BASE_URL

// HTTP client utility - abstraction layer
class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw error
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API Error for POST ${endpoint}:`, error)
      throw error
    }
  }
}

// Initialize HTTP client
const httpClient = new HttpClient(API_BASE_URL)

// Product Service - Single Responsibility Principle
export const productService = {
  // Get all products
  async getAllProducts() {
    return await httpClient.get('/products')
  },

  // Get single product
  async getProduct(id) {
    return await httpClient.get(`/products/${id}`)
  },

  // Get products by category
  async getProductsByCategory(category) {
    return await httpClient.get(`/products/category/${category}`)
  },

  // Get all categories
  async getCategories() {
    return await httpClient.get('/products/categories')
  },

  // Sort products utility
  sortProducts(products, sortBy) {
    const sortedProducts = [...products]
    
    switch (sortBy) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sortedProducts.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
      case 'name-desc':
        return sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate)
      default:
        return sortedProducts
    }
  },

  // Filter products utility
  filterProducts(products, filters) {
    let filteredProducts = [...products]

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category === filters.category
      )
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange
      filteredProducts = filteredProducts.filter(
        product => product.price >= minPrice && product.price <= maxPrice
      )
    }

    return filteredProducts
  }
}

// Error handling utility
export const handleApiError = (error) => {
  if (error.name === 'TypeError') {
    return ERROR_MESSAGES.NETWORK_ERROR
  }
  
  if (error.message.includes('404')) {
    return ERROR_MESSAGES.NOT_FOUND
  }
  
  if (error.message.includes('500')) {
    return ERROR_MESSAGES.SERVER_ERROR
  }
  
  return error.message || ERROR_MESSAGES.GENERIC_ERROR
}