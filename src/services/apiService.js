/**
 * API Service Layer
 * 
 * This service provides a clean abstraction layer for all API interactions.
 * It handles data fetching, transformation, caching, and error handling.
 * 
 * Author: MiniMax Agent
 * Version: 1.0.0
 * Created: 2025-08-14
 */

import {
  API_CONFIG,
  transformApiToProperty,
  transformPropertyToApi,
  buildApiQuery
} from '../config/apiMappings.js';

// =============================================================================
// CORE API CLIENT
// =============================================================================

class ApiClient {
  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.endpoints = config.endpoints;
    this.config = config.requests;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Generic fetch method with error handling and retries
   */
  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers
      }
    };

    let lastError;
    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        if (attempt < this.config.retries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get data with caching
   */
  async get(endpoint, useCache = true) {
    const cacheKey = endpoint;
    
    // Check cache
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }
    
    // Fetch data
    const data = await this.fetch(endpoint);
    
    // Cache data
    if (useCache) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  }

  /**
   * Post data
   */
  async post(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Update data
   */
  async put(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete data
   */
  async delete(endpoint) {
    return this.fetch(endpoint, {
      method: 'DELETE'
    });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// =============================================================================
// PROPERTY API METHODS
// =============================================================================

/**
 * Fetch all properties
 */
export async function fetchProperties(useCache = true) {
  try {
    const data = await apiClient.get(API_CONFIG.endpoints.properties, useCache);
    
    // Transform API data to internal format
    if (Array.isArray(data)) {
      return data.map(transformApiToProperty);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
}

/**
 * Search properties with filters
 */
export async function searchProperties(filters = {}, sortBy = 'default') {
  try {
    // Build query parameters
    const queryParams = buildApiQuery(filters);
    
    // For static JSON files, we fetch all and filter client-side
    // In a real API, you would append query parameters to the endpoint
    const allProperties = await fetchProperties();
    
    // Apply client-side filtering (replace with server-side when using real API)
    let filtered = applyFiltersClientSide(allProperties, filters);
    
    // Apply sorting
    filtered = applySortingClientSide(filtered, sortBy);
    
    return filtered;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw new Error('Failed to search properties');
  }
}

/**
 * Get property by ID
 */
export async function fetchPropertyById(id) {
  try {
    const properties = await fetchProperties();
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    return property;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Create new property
 */
export async function createProperty(propertyData) {
  try {
    // Transform internal format to API format
    const apiData = transformPropertyToApi(propertyData);
    
    // In a real API, this would POST to the properties endpoint
    const response = await apiClient.post(API_CONFIG.endpoints.properties, apiData);
    
    // Transform response back to internal format
    return transformApiToProperty(response);
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
}

/**
 * Update existing property
 */
export async function updateProperty(id, propertyData) {
  try {
    // Transform internal format to API format
    const apiData = transformPropertyToApi(propertyData);
    
    // In a real API, this would PUT to the properties endpoint
    const response = await apiClient.put(`${API_CONFIG.endpoints.properties}/${id}`, apiData);
    
    // Transform response back to internal format
    return transformApiToProperty(response);
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
}

/**
 * Delete property
 */
export async function deleteProperty(id) {
  try {
    await apiClient.delete(`${API_CONFIG.endpoints.properties}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
}

// =============================================================================
// FILTER OPTIONS API METHODS
// =============================================================================

/**
 * Fetch filter options (cities, property types, etc.)
 */
export async function fetchFilterOptions() {
  try {
    const data = await apiClient.get(API_CONFIG.endpoints.filters);
    return data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error('Failed to fetch filter options');
  }
}

/**
 * Fetch cities
 */
export async function fetchCities() {
  try {
    const filterOptions = await fetchFilterOptions();
    return filterOptions.cities || [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

/**
 * Fetch property types
 */
export async function fetchPropertyTypes() {
  try {
    const filterOptions = await fetchFilterOptions();
    return filterOptions.propertyTypes || [];
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
}

// =============================================================================
// USER/FAVORITES API METHODS
// =============================================================================

/**
 * Fetch user data
 */
export async function fetchUserData() {
  try {
    const data = await apiClient.get(API_CONFIG.endpoints.user);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}

/**
 * Update user favorites
 */
export async function updateUserFavorites(favorites) {
  try {
    const userData = await fetchUserData();
    const updatedUser = { ...userData, favorites };
    
    // In a real API, this would PUT to the user endpoint
    await apiClient.put(API_CONFIG.endpoints.favorites, updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user favorites:', error);
    throw new Error('Failed to update favorites');
  }
}

// =============================================================================
// CLIENT-SIDE FILTERING (for static JSON)
// =============================================================================

/**
 * Apply filters client-side (used with static JSON files)
 * Replace this with server-side filtering when using a real API
 */
function applyFiltersClientSide(properties, filters) {
  let filtered = [...properties];

  // Keyword search
  if (filters.keyword && filters.keyword.trim()) {
    const keyword = filters.keyword.toLowerCase().trim();
    filtered = filtered.filter(property => 
      property.title?.toLowerCase().includes(keyword) ||
      property.address?.toLowerCase().includes(keyword) ||
      property.city?.toLowerCase().includes(keyword) ||
      property.region?.toLowerCase().includes(keyword) ||
      property.propertyType?.toLowerCase().includes(keyword) ||
      property.id?.includes(keyword)
    );
  }

  // City filter
  if (filters.city && filters.city.length > 0) {
    filtered = filtered.filter(property => 
      filters.city.some(city => 
        property.city?.toLowerCase() === city.toLowerCase()
      )
    );
  }

  // Property type filter
  if (filters.propertyType && filters.propertyType.length > 0) {
    filtered = filtered.filter(property => 
      filters.propertyType.some(type => 
        property.propertyType?.toLowerCase() === type.toLowerCase() ||
        property.propertyType?.toLowerCase().replace(/\s+/g, '-') === type.toLowerCase()
      )
    );
  }

  // Contract type filter
  if (filters.contractType && filters.contractType.length > 0 && !filters.contractType.includes('entrambi')) {
    filtered = filtered.filter(property => 
      filters.contractType.some(type => 
        property.contractType?.toLowerCase() === type.toLowerCase()
      )
    );
  }

  // Bedrooms filter
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    filtered = filtered.filter(property => 
      filters.bedrooms.some(bedroom => {
        if (bedroom === '5+') {
          return property.bedrooms >= 5;
        }
        return property.bedrooms === parseInt(bedroom);
      })
    );
  }

  // Bathrooms filter
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    filtered = filtered.filter(property => 
      filters.bathrooms.some(bathroom => {
        if (bathroom === '4+') {
          return property.bathrooms >= 4;
        }
        return property.bathrooms === parseInt(bathroom);
      })
    );
  }

  // Price range
  if (filters.priceMin) {
    const minPrice = parseFloat(filters.priceMin);
    filtered = filtered.filter(property => property.price >= minPrice);
  }
  if (filters.priceMax) {
    const maxPrice = parseFloat(filters.priceMax);
    filtered = filtered.filter(property => property.price <= maxPrice);
  }

  // Area range
  if (filters.areaMin && filters.areaMin.length > 0) {
    filtered = filtered.filter(property => 
      filters.areaMin.some(minArea => {
        const min = parseInt(minArea);
        return property.area >= min;
      })
    );
  }
  if (filters.areaMax && filters.areaMax.length > 0) {
    filtered = filtered.filter(property => 
      filters.areaMax.some(maxArea => {
        if (maxArea === '500+') {
          return property.area >= 500;
        }
        const max = parseInt(maxArea);
        return property.area <= max;
      })
    );
  }

  return filtered;
}

/**
 * Apply sorting client-side
 */
function applySortingClientSide(properties, sortBy) {
  const sorted = [...properties];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area_asc':
      return sorted.sort((a, b) => a.area - b.area);
    case 'area_desc':
      return sorted.sort((a, b) => b.area - a.area);
    case 'bedrooms_asc':
      return sorted.sort((a, b) => a.bedrooms - b.bedrooms);
    case 'bedrooms_desc':
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
    case 'newest':
      return sorted.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    case 'default':
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
  }
}

// =============================================================================
// EXPORT API CLIENT AND METHODS
// =============================================================================

export { apiClient };

export default {
  fetchProperties,
  searchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  fetchFilterOptions,
  fetchCities,
  fetchPropertyTypes,
  fetchUserData,
  updateUserFavorites,
  apiClient
};