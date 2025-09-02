/**
 * API-Agnostic Properties Hook
 * 
 * This hook provides a clean interface to property data using the centralized API mapping.
 * It replaces the previous useProperties hook with a fully API-agnostic implementation.
 * 
 * Author: MiniMax Agent
 * Version: 1.0.0
 * Created: 2025-08-14
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProperties,
  searchProperties,
  fetchPropertyById,
  fetchFilterOptions
} from '../services/apiService.js';
import { FILTER_CONFIGURATIONS, SORT_OPTIONS } from '../config/apiMappings.js';

// =============================================================================
// TYPES
// =============================================================================

interface Property {
  id: string;
  title: string;
  address?: string;
  city?: string;
  region?: string;
  propertyType?: string;
  contractType?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  mainImage?: string;
  badges?: string[];
  featured?: boolean;
  isNew?: boolean;
  price: number;
  priceHidden?: boolean;
  description?: string;
  energyRating?: string;
  features?: string[];
  amenities?: string[];
  agent?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Filters {
  keyword: string;
  city: string[];
  region: string[];
  propertyType: string[];
  contractType: string[];
  bedrooms: string[];
  bathrooms: string[];
  areaMin: string[];
  areaMax: string[];
  priceMin: string;
  priceMax: string;
  features: string[];
  energyRating: string[];
  [key: string]: any;
}

interface UseApiPropertiesReturn {
  // Data
  properties: Property[];
  filteredProperties: Property[];
  filterOptions: any;
  
  // State
  filters: Filters;
  sortBy: string;
  favorites: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  updateFilter: (key: keyof Filters, value: string | string[]) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: string) => void;
  toggleFavorite: (propertyId: string) => void;
  search: () => void;
  refresh: () => void;
  
  // Single property operations
  getPropertyById: (id: string) => Promise<Property | null>;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_FILTERS: Filters = {
  keyword: '',
  city: [],
  region: [],
  propertyType: [],
  contractType: ['vendita'], // Default to 'For Sale'
  bedrooms: [],
  bathrooms: [],
  areaMin: [],
  areaMax: [],
  priceMin: '',
  priceMax: '',
  features: [],
  energyRating: []
};

// =============================================================================
// MAIN HOOK
// =============================================================================

export const useApiProperties = (): UseApiPropertiesReturn => {
  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<string>('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  // =============================================================================
  // FAVORITES MANAGEMENT
  // =============================================================================

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('realEstate_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('realEstate_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // =============================================================================
  // DATA LOADING
  // =============================================================================

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load properties and filter options in parallel
      const [propertiesData, filterOptionsData] = await Promise.all([
        fetchProperties(),
        fetchFilterOptions()
      ]);

      setProperties(propertiesData);
      setFilterOptions(filterOptionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // =============================================================================
  // FILTERING AND SEARCHING
  // =============================================================================

  // Apply search when filters or sort order changes
  useEffect(() => {
    const performSearch = async () => {
      if (properties.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const results = await searchProperties(filters, sortBy);
        setFilteredProperties(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        console.error('Error performing search:', err);
        // Fallback to client-side filtering if API search fails
        setFilteredProperties(properties);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [properties, filters, sortBy, searchTrigger]);

  // =============================================================================
  // ACTION HANDLERS
  // =============================================================================

  const updateFilter = useCallback((key: keyof Filters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  }, []);

  const search = useCallback(() => {
    setSearchTrigger(prev => prev + 1);
  }, []);

  const refresh = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  const getPropertyById = useCallback(async (id: string): Promise<Property | null> => {
    try {
      return await fetchPropertyById(id);
    } catch (err) {
      console.error('Error fetching property by ID:', err);
      return null;
    }
  }, []);

  // =============================================================================
  // RETURN INTERFACE
  // =============================================================================

  return {
    // Data
    properties,
    filteredProperties,
    filterOptions,
    
    // State
    filters,
    sortBy,
    favorites,
    loading,
    error,
    
    // Actions
    updateFilter,
    clearFilters,
    setSortBy,
    toggleFavorite,
    search,
    refresh,
    getPropertyById
  };
};

// =============================================================================
// ADDITIONAL UTILITY HOOKS
// =============================================================================

/**
 * Hook for single property data
 */
export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const propertyData = await fetchPropertyById(id);
        setProperty(propertyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  return { property, loading, error };
};

/**
 * Hook for filter options
 */
export const useFilterOptions = () => {
  const [options, setOptions] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const optionsData = await fetchFilterOptions();
        setOptions(optionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load filter options');
        console.error('Error loading filter options:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { options, loading, error };
};

// =============================================================================
// EXPORT
// =============================================================================

export default useApiProperties;