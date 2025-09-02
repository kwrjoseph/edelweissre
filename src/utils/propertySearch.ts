// Real property search functionality

export interface Property {
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

export interface SearchFilters {
  location?: string;
  city?: string;
  propertyType?: string;
  contractType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  quickFilters?: {
    vistaLago?: boolean;
    piscina?: boolean;
    nuovaCostruzione?: boolean;
    centroStorico?: boolean;
  };
}

export interface SearchResult {
  properties: Property[];
  totalCount: number;
  searchTime: number;
  appliedFilters: SearchFilters;
}

// Cache for properties data
let propertiesCache: Property[] | null = null;

// Load properties data
export const loadProperties = async (): Promise<Property[]> => {
  if (propertiesCache) {
    return propertiesCache;
  }

  try {
    const response = await fetch('/data/properties.json');
    if (!response.ok) {
      throw new Error('Failed to load properties');
    }
    const properties: Property[] = await response.json();
    propertiesCache = properties;
    return properties;
  } catch (error) {
    console.error('Error loading properties:', error);
    return [];
  }
};

// Location mapping for search
const locationMapping: { [key: string]: string[] } = {
  'dolomiti': ['Cortina d\'Ampezzo', 'Val di Fassa', 'Alto Adige'],
  'venezia': ['Venezia', 'Mestre', 'Padova'],
  'prosecco': ['Valdobbiadene', 'Conegliano', 'Treviso'],
  'como': ['Como', 'Bellagio', 'Lecco'],
  'garda': ['Sirmione', 'Riva del Garda', 'Desenzano'],
  'toscana': ['Firenze', 'Siena', 'Pisa', 'Arezzo']
};

// Search function with real filtering
export const searchProperties = async (filters: SearchFilters): Promise<SearchResult> => {
  const startTime = Date.now();
  const properties = await loadProperties();
  
  let filteredProperties = [...properties];
  
  // Apply location filter
  if (filters.location) {
    const locationCities = locationMapping[filters.location.toLowerCase()];
    if (locationCities) {
      filteredProperties = filteredProperties.filter(property => 
        locationCities.some(city => 
          property.city.toLowerCase().includes(city.toLowerCase()) ||
          property.address.toLowerCase().includes(city.toLowerCase())
        )
      );
    }
  }
  
  // Apply city filter
  if (filters.city) {
    filteredProperties = filteredProperties.filter(property => 
      property.city.toLowerCase().includes(filters.city!.toLowerCase()) ||
      property.address.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }
  
  // Apply property type filter
  if (filters.propertyType) {
    filteredProperties = filteredProperties.filter(property => 
      property.propertyType.toLowerCase() === filters.propertyType!.toLowerCase()
    );
  }
  
  // Apply contract type filter
  if (filters.contractType) {
    const contractMap: { [key: string]: string } = {
      'vendita': 'Vendita',
      'affitto': 'Affitto'
    };
    const targetContract = contractMap[filters.contractType.toLowerCase()] || filters.contractType;
    filteredProperties = filteredProperties.filter(property => 
      property.contractType.toLowerCase().includes(targetContract.toLowerCase())
    );
  }
  
  // Apply bedroom filter
  if (filters.minBedrooms) {
    filteredProperties = filteredProperties.filter(property => 
      property.bedrooms >= filters.minBedrooms!
    );
  }
  if (filters.maxBedrooms) {
    filteredProperties = filteredProperties.filter(property => 
      property.bedrooms <= filters.maxBedrooms!
    );
  }
  
  // Apply bathroom filter
  if (filters.minBathrooms) {
    filteredProperties = filteredProperties.filter(property => 
      property.bathrooms >= filters.minBathrooms!
    );
  }
  if (filters.maxBathrooms) {
    filteredProperties = filteredProperties.filter(property => 
      property.bathrooms <= filters.maxBathrooms!
    );
  }
  
  // Apply price filter (only if price is not hidden)
  if (filters.minPrice) {
    filteredProperties = filteredProperties.filter(property => 
      !property.priceHidden && property.price >= filters.minPrice!
    );
  }
  if (filters.maxPrice) {
    filteredProperties = filteredProperties.filter(property => 
      !property.priceHidden && property.price <= filters.maxPrice!
    );
  }
  
  // Apply area filter
  if (filters.minArea) {
    filteredProperties = filteredProperties.filter(property => 
      property.area >= filters.minArea!
    );
  }
  if (filters.maxArea) {
    filteredProperties = filteredProperties.filter(property => 
      property.area <= filters.maxArea!
    );
  }
  
  // Apply quick filters (simulated based on property characteristics)
  if (filters.quickFilters) {
    if (filters.quickFilters.vistaLago) {
      // Properties near lakes (Como, Garda areas)
      filteredProperties = filteredProperties.filter(property => 
        ['Como', 'Bellagio', 'Lecco', 'Sirmione', 'Riva del Garda', 'Desenzano'].some(city =>
          property.city.includes(city) || property.address.includes(city)
        )
      );
    }
    
    if (filters.quickFilters.piscina) {
      // Assume villas and larger properties have pools
      filteredProperties = filteredProperties.filter(property => 
        property.propertyType.toLowerCase().includes('villa') || 
        property.area > 200 ||
        property.price > 800000
      );
    }
    
    if (filters.quickFilters.nuovaCostruzione) {
      // Properties marked as new or with modern characteristics
      filteredProperties = filteredProperties.filter(property => 
        property.isNew || 
        property.badges.some(badge => badge.toLowerCase().includes('novità'))
      );
    }
    
    if (filters.quickFilters.centroStorico) {
      // Properties in historic city centers
      filteredProperties = filteredProperties.filter(property => 
        property.address.toLowerCase().includes('centro') ||
        property.address.toLowerCase().includes('roma') ||
        property.address.toLowerCase().includes('venezia') ||
        ['Milano', 'Firenze', 'Roma', 'Venezia'].some(city => property.city.includes(city))
      );
    }
  }
  
  const searchTime = Date.now() - startTime;
  
  return {
    properties: filteredProperties,
    totalCount: filteredProperties.length,
    searchTime,
    appliedFilters: filters
  };
};

// Get property suggestions based on partial input
export const getPropertySuggestions = async (query: string): Promise<string[]> => {
  const properties = await loadProperties();
  const suggestions = new Set<string>();
  
  const queryLower = query.toLowerCase();
  
  properties.forEach(property => {
    // Add city suggestions
    if (property.city.toLowerCase().includes(queryLower)) {
      suggestions.add(property.city);
    }
    
    // Add property type suggestions
    if (property.propertyType.toLowerCase().includes(queryLower)) {
      suggestions.add(property.propertyType);
    }
    
    // Add address parts
    const addressParts = property.address.split(',');
    addressParts.forEach(part => {
      const trimmedPart = part.trim();
      if (trimmedPart.toLowerCase().includes(queryLower) && trimmedPart.length > 2) {
        suggestions.add(trimmedPart);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 10); // Limit to 10 suggestions
};

// Get property statistics
export const getPropertyStats = async () => {
  const properties = await loadProperties();
  
  const stats = {
    totalProperties: properties.length,
    averagePrice: 0,
    propertyTypes: {} as { [key: string]: number },
    cities: {} as { [key: string]: number },
    priceRanges: {
      'under_500k': 0,
      '500k_1m': 0,
      '1m_2m': 0,
      'over_2m': 0
    }
  };
  
  let totalPrice = 0;
  let propertiesWithPrice = 0;
  
  properties.forEach(property => {
    // Count property types
    stats.propertyTypes[property.propertyType] = (stats.propertyTypes[property.propertyType] || 0) + 1;
    
    // Count cities
    stats.cities[property.city] = (stats.cities[property.city] || 0) + 1;
    
    // Calculate price statistics
    if (!property.priceHidden) {
      totalPrice += property.price;
      propertiesWithPrice++;
      
      if (property.price < 500000) {
        stats.priceRanges.under_500k++;
      } else if (property.price < 1000000) {
        stats.priceRanges['500k_1m']++;
      } else if (property.price < 2000000) {
        stats.priceRanges['1m_2m']++;
      } else {
        stats.priceRanges.over_2m++;
      }
    }
  });
  
  stats.averagePrice = propertiesWithPrice > 0 ? Math.round(totalPrice / propertiesWithPrice) : 0;
  
  return stats;
};