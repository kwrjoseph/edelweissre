import { useState, useEffect, useMemo } from 'react';
import propertiesData from '../data/properties.json';
import { AdvancedFilterState } from '../components/AdvancedFiltersPanel';
import useUrlParams from './useUrlParams';

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  region: string;
  propertyType: string;
  contractType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  badges: string[];
  featured: boolean;
  isNew: boolean;
  price: number;
  priceHidden: boolean;
}

interface Filters {
  keyword: string;
  location: string[];
  city: string[];
  propertyType: string[];
  contractType: string[];
  bedrooms: string[];
  bathrooms: string[];
  areaMin: string[];
  areaMax: string[];
}

interface UsePropertiesReturn {
  properties: Property[];
  filteredProperties: Property[];
  filters: Filters;
  advancedFilters: AdvancedFilterState;
  favorites: string[];
  sortBy: string;
  updateFilter: (key: keyof Filters, value: string | string[]) => void;
  updateAdvancedFilters: (filters: AdvancedFilterState) => void;
  clearAdvancedFilters: () => void;
  toggleFavorite: (propertyId: string) => void;
  setSortBy: (sortBy: string) => void;
  search: () => void;
  isLoading: boolean;
}

const useProperties = (): UsePropertiesReturn => {
  const [properties] = useState<Property[]>(propertiesData as Property[]);
  const { getFiltersFromUrl, updateUrlFromFilters, hasUrlParams } = useUrlParams();
  
  // Initialize filters - check URL first, then use defaults
  const initializeFilters = () => {
    if (hasUrlParams()) {
      const { filters, advancedFilters } = getFiltersFromUrl();
      return { filters, advancedFilters };
    }
    
    return {
      filters: {
        keyword: '',
        location: [],
        city: [],
        propertyType: [],
        contractType: ['vendita'], // Default to 'In Vendita'
        bedrooms: [],
        bathrooms: [],
        areaMin: [],
        areaMax: []
      },
      advancedFilters: {
        priceMin: '',
        priceMax: '',
        propertyType: [],
        bedrooms: '',
        bathrooms: '',
        area: '',
        areaMax: '',
        location: [],
        zones: [],
        contractType: '',
        yearMin: '',
        yearMax: '',
        features: [],
        amenities: [],
        energyRating: [],
        propertyCondition: '',
        schoolDistrict: '',
        transportProximity: [],
      }
    };
  };
  
  const initialState = initializeFilters();
  const [filters, setFilters] = useState<Filters>(initialState.filters);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>(initialState.advancedFilters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [urlSyncEnabled, setUrlSyncEnabled] = useState(true);

  // Sync filters with URL parameters on change
  useEffect(() => {
    if (urlSyncEnabled) {
      updateUrlFromFilters(filters, advancedFilters);
    }
  }, [filters, advancedFilters, updateUrlFromFilters, urlSyncEnabled]);
  
  // Load filters from URL parameters on mount or URL change
  useEffect(() => {
    if (hasUrlParams()) {
      const { filters: urlFilters, advancedFilters: urlAdvancedFilters } = getFiltersFromUrl();
      setUrlSyncEnabled(false); // Temporarily disable URL sync to prevent loops
      setFilters(urlFilters);
      setAdvancedFilters(urlAdvancedFilters);
      setUrlSyncEnabled(true); // Re-enable URL sync
    }
  }, []);

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

  const updateFilter = (key: keyof Filters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // URL will be updated automatically via useEffect
  };

  const updateAdvancedFilters = (filters: AdvancedFilterState) => {
    setAdvancedFilters(filters);
    // URL will be updated automatically via useEffect
  };

  const clearAdvancedFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      propertyType: [],
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaMax: '',
      location: [],
      zones: [],
      contractType: '',
      yearMin: '',
      yearMax: '',
      features: [],
      amenities: [],
      energyRating: [],
      propertyCondition: '',
      schoolDistrict: '',
      transportProximity: [],
    };
    setAdvancedFilters(clearedFilters);
    // URL will be updated automatically via useEffect
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const search = () => {
    setSearchTrigger(prev => prev + 1);
  };

  const applySorting = (properties: Property[], sortBy: string): Property[] => {
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
          // Sort new properties first, then featured
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
      case 'default':
      default:
        return sorted.sort((a, b) => {
          // Default: featured first, then new, then others
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
    }
  };

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Basic keyword search
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(keyword) ||
        property.address.toLowerCase().includes(keyword) ||
        property.city.toLowerCase().includes(keyword) ||
        property.region.toLowerCase().includes(keyword) ||
        property.propertyType.toLowerCase().includes(keyword) ||
        property.id.includes(keyword)
      );
    }

    // Basic city filter
    if (filters.city.length > 0) {
      filtered = filtered.filter(property => 
        filters.city.some(city => 
          property.city.toLowerCase() === city.toLowerCase()
        )
      );
    }

    // Basic location filter
    if (filters.location.length > 0) {
      // Note: Location filtering would need location data in properties
      // For now, implementing as a placeholder
      console.log('Location filtering:', filters.location);
    }

    // Basic property type filter
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyType.some(type => 
          property.propertyType.toLowerCase() === type.toLowerCase() ||
          property.propertyType.toLowerCase().replace(/\s+/g, '-') === type.toLowerCase()
        )
      );
    }

    // Basic contract type filter
    if (filters.contractType.length > 0 && !filters.contractType.includes('entrambi')) {
      filtered = filtered.filter(property => 
        filters.contractType.some(type => 
          property.contractType.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
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
    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bathrooms.some(bathroom => {
          if (bathroom === '4+') {
            return property.bathrooms >= 4;
          }
          return property.bathrooms === parseInt(bathroom);
        })
      );
    }

    // Area Min filter
    if (filters.areaMin.length > 0) {
      filtered = filtered.filter(property => 
        filters.areaMin.some(minArea => {
          const min = parseInt(minArea);
          return property.area >= min;
        })
      );
    }

    // Area Max filter
    if (filters.areaMax.length > 0) {
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

    // Advanced filters
    // Price range
    if (advancedFilters.priceMin) {
      const minPrice = parseFloat(advancedFilters.priceMin);
      filtered = filtered.filter(property => property.price >= minPrice);
    }
    if (advancedFilters.priceMax) {
      const maxPrice = parseFloat(advancedFilters.priceMax);
      filtered = filtered.filter(property => property.price <= maxPrice);
    }

    // Advanced property type (multi-select)
    if (advancedFilters.propertyType && advancedFilters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        advancedFilters.propertyType.some(type => 
          property.propertyType.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Advanced contract type
    if (advancedFilters.contractType) {
      filtered = filtered.filter(property => 
        property.contractType.toLowerCase() === advancedFilters.contractType.toLowerCase()
      );
    }

    // Bedrooms
    if (advancedFilters.bedrooms) {
      const bedrooms = advancedFilters.bedrooms === '5+' ? 5 : parseInt(advancedFilters.bedrooms);
      if (advancedFilters.bedrooms === '5+') {
        filtered = filtered.filter(property => property.bedrooms >= bedrooms);
      } else {
        filtered = filtered.filter(property => property.bedrooms === bedrooms);
      }
    }

    // Bathrooms
    if (advancedFilters.bathrooms) {
      const bathrooms = advancedFilters.bathrooms === '4+' ? 4 : parseInt(advancedFilters.bathrooms);
      if (advancedFilters.bathrooms === '4+') {
        filtered = filtered.filter(property => property.bathrooms >= bathrooms);
      } else {
        filtered = filtered.filter(property => property.bathrooms === bathrooms);
      }
    }

    // Area range
    if (advancedFilters.area) {
      const minArea = parseFloat(advancedFilters.area);
      filtered = filtered.filter(property => property.area >= minArea);
    }
    if (advancedFilters.areaMax) {
      const maxArea = parseFloat(advancedFilters.areaMax);
      filtered = filtered.filter(property => property.area <= maxArea);
    }

    // Location/Cities (multi-select)
    if (advancedFilters.location && advancedFilters.location.length > 0) {
      filtered = filtered.filter(property => 
        advancedFilters.location.some(city => 
          property.city.toLowerCase() === city.toLowerCase()
        )
      );
    }

    // Zones (multi-select) - Note: This would require zone data in properties
    // For now, we'll implement it as a placeholder for future zone-based filtering
    if (advancedFilters.zones && advancedFilters.zones.length > 0) {
      // This would filter by zones if property data included zone information
      // filtered = filtered.filter(property => 
      //   property.zone && advancedFilters.zones.some(zone => 
      //     property.zone.toLowerCase() === zone.toLowerCase()
      //   )
      // );
      console.log('Zone filtering would be applied here when zone data is available:', advancedFilters.zones);
    }

    // Apply sorting
    filtered = applySorting(filtered, sortBy);

    return filtered;
  }, [properties, filters, advancedFilters, searchTrigger, sortBy]);

  return {
    properties,
    filteredProperties,
    filters,
    advancedFilters,
    favorites,
    sortBy,
    updateFilter,
    updateAdvancedFilters,
    clearAdvancedFilters,
    toggleFavorite,
    setSortBy,
    search,
    isLoading
  };
};

export default useProperties;