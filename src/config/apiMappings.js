/**
 * Centralized API Mapping Configuration
 * 
 * This file provides a complete abstraction layer between the UI components and external APIs.
 * Simply update the field mappings to connect to any real estate API without changing component code.
 * 
 * Author: MiniMax Agent
 * Version: 1.0.0
 * Created: 2025-08-14
 */

// =============================================================================
// CORE API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  // Base API endpoint - update this to point to your backend
  baseUrl: '/data', // Default: local JSON files
  
  // API endpoints configuration
  endpoints: {
    properties: '/properties.json',
    filters: '/filters.json',
    user: '/mockUser.json',
    search: '/properties.json', // For search functionality
    favorites: '/mockUser.json' // For favorites management
  },
  
  // Request configuration
  requests: {
    timeout: 10000,
    retries: 3,
    headers: {
      'Content-Type': 'application/json',
      // Add API keys or auth headers here
      // 'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
};

// =============================================================================
// PROPERTY DATA FIELD MAPPINGS
// =============================================================================

/**
 * Maps external API field names to internal property object structure
 * Update these mappings to match your API's field names
 */
export const PROPERTY_FIELD_MAPPINGS = {
  // Core identification
  id: 'id',                           // string - unique property identifier
  title: 'title',                     // string - property title/name
  description: 'description',         // string - property description
  
  // Location information
  address: 'address',                 // string - full address
  city: 'city',                       // string - city name
  region: 'region',                   // string - region/state
  country: 'country',                 // string - country
  zipCode: 'zipCode',                 // string - postal code
  neighborhood: 'neighborhood',       // string - neighborhood/district
  coordinates: {
    latitude: 'coordinates.lat',      // number - latitude
    longitude: 'coordinates.lng'      // number - longitude
  },
  
  // Property characteristics
  propertyType: 'propertyType',       // string - apartment, villa, house, etc.
  contractType: 'contractType',       // string - sale, rent, etc.
  bedrooms: 'bedrooms',               // number - number of bedrooms
  bathrooms: 'bathrooms',             // number - number of bathrooms
  area: 'area',                       // number - area in square meters
  areaUnit: 'areaUnit',               // string - 'sqm', 'sqft', etc.
  yearBuilt: 'yearBuilt',             // number - construction year
  floors: 'floors',                   // number - number of floors
  floor: 'floor',                     // number - which floor (for apartments)
  
  // Financial information
  price: 'price',                     // number - property price
  pricePerSqm: 'pricePerSqm',         // number - price per square meter
  currency: 'currency',               // string - EUR, USD, etc.
  priceHidden: 'priceHidden',         // boolean - whether price is hidden
  
  // Media and visual content
  images: 'images',                   // array - array of image URLs
  mainImage: 'image_url',             // string - primary image URL
  virtualTour: 'virtualTour',         // string - virtual tour URL
  floorPlan: 'floorPlan',             // string - floor plan image URL
  
  // Status and badges
  badges: 'badges',                   // array - property badges/tags
  featured: 'featured',               // boolean - is featured property
  isNew: 'isNew',                     // boolean - is new listing
  status: 'status',                   // string - active, sold, rented, etc.
  
  // Additional features
  features: 'features',               // array - property features
  amenities: 'amenities',             // array - building/area amenities
  parking: 'parking',                 // boolean/number - parking availability
  garden: 'garden',                   // boolean - has garden
  balcony: 'balcony',                 // boolean - has balcony
  elevator: 'elevator',               // boolean - has elevator
  furnished: 'furnished',             // boolean - is furnished
  
  // Energy and condition
  energyRating: 'energyRating',       // string - energy efficiency rating
  condition: 'condition',             // string - property condition
  
  // Agent and contact information
  agent: {
    id: 'agent.id',                   // string - agent ID
    name: 'agent.name',               // string - agent name
    phone: 'agent.phone',             // string - agent phone
    email: 'agent.email'              // string - agent email
  },
  
  // Timestamps
  createdAt: 'createdAt',             // string/date - listing creation date
  updatedAt: 'updatedAt'              // string/date - last update date
};

// =============================================================================
// COMPREHENSIVE FILTER CONFIGURATION
// =============================================================================

/**
 * Complete filter options data - centralized for API agnosticism
 */
export const FILTER_OPTIONS_DATA = {
  // Italian Cities (comprehensive list)
  cities: [
    { value: 'milano', label: 'Milano' },
    { value: 'roma', label: 'Roma' },
    { value: 'napoli', label: 'Napoli' },
    { value: 'torino', label: 'Torino' },
    { value: 'palermo', label: 'Palermo' },
    { value: 'genova', label: 'Genova' },
    { value: 'bologna', label: 'Bologna' },
    { value: 'firenze', label: 'Firenze' },
    { value: 'bari', label: 'Bari' },
    { value: 'catania', label: 'Catania' },
    { value: 'venezia', label: 'Venezia' },
    { value: 'verona', label: 'Verona' },
    { value: 'messina', label: 'Messina' },
    { value: 'padova', label: 'Padova' },
    { value: 'trieste', label: 'Trieste' },
    { value: 'brescia', label: 'Brescia' },
    { value: 'taranto', label: 'Taranto' },
    { value: 'prato', label: 'Prato' },
    { value: 'modena', label: 'Modena' },
    { value: 'reggio-calabria', label: 'Reggio Calabria' },
    { value: 'reggio-emilia', label: 'Reggio Emilia' },
    { value: 'perugia', label: 'Perugia' },
    { value: 'livorno', label: 'Livorno' },
    { value: 'ravenna', label: 'Ravenna' },
    { value: 'cagliari', label: 'Cagliari' },
    { value: 'foggia', label: 'Foggia' },
    { value: 'rimini', label: 'Rimini' },
    { value: 'salerno', label: 'Salerno' },
    { value: 'ferrara', label: 'Ferrara' },
    { value: 'sassari', label: 'Sassari' },
    { value: 'como', label: 'Como' }
  ],

  // Location/Neighborhood types
  locations: [
    { value: 'centro-storico', label: 'Centro Storico' },
    { value: 'zona-residenziale', label: 'Zona Residenziale' },
    { value: 'periferia', label: 'Periferia' },
    { value: 'zona-commerciale', label: 'Zona Commerciale' },
    { value: 'zona-universitaria', label: 'Zona Universitaria' },
    { value: 'zona-industriale', label: 'Zona Industriale' },
    { value: 'lungomare', label: 'Lungomare' },
    { value: 'collina', label: 'Collina' },
    { value: 'montagna', label: 'Montagna' },
    { value: 'lago', label: 'Lago' }
  ],

  // Property Types (comprehensive)
  propertyTypes: [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'attico', label: 'Attico' },
    { value: 'villa', label: 'Villa' },
    { value: 'villetta', label: 'Villetta' },
    { value: 'casa-indipendente', label: 'Casa Indipendente' },
    { value: 'casa-a-schiera', label: 'Casa a Schiera' },
    { value: 'bifamiliare', label: 'Bifamiliare' },
    { value: 'loft', label: 'Loft' },
    { value: 'mansarda', label: 'Mansarda' },
    { value: 'ufficio', label: 'Ufficio' },
    { value: 'locale-commerciale', label: 'Locale Commerciale' },
    { value: 'capannone', label: 'Capannone' },
    { value: 'magazzino', label: 'Magazzino' },
    { value: 'laboratorio', label: 'Laboratorio' },
    { value: 'palazzo', label: 'Palazzo' },
    { value: 'castello', label: 'Castello' },
    { value: 'cascina', label: 'Cascina' },
    { value: 'masseria', label: 'Masseria' },
    { value: 'trullo', label: 'Trullo' },
    { value: 'chalet', label: 'Chalet' },
    { value: 'baita', label: 'Baita' },
    { value: 'rustico', label: 'Rustico' },
    { value: 'dimora-storica', label: 'Dimora Storica' },
    { value: 'casa-di-campagna', label: 'Casa di Campagna' },
    { value: 'casa-al-mare', label: 'Casa al Mare' },
    { value: 'azienda-agricola', label: 'Azienda Agricola' }
  ],

  // Contract Types
  contractTypes: [
    { value: 'vendita', label: 'In Vendita' },
    { value: 'affitto', label: 'In Affitto' },
    { value: 'affitto-breve', label: 'Affitto Breve' },
    { value: 'asta', label: 'Asta Immobiliare' },
    { value: 'permuta', label: 'Permuta' },
    { value: 'trattativa', label: 'In Trattativa' },
    { value: 'entrambi', label: 'Entrambi' }
  ],

  // Bedrooms
  bedrooms: [
    { value: '1', label: '1 Camera' },
    { value: '2', label: '2 Camere' },
    { value: '3', label: '3 Camere' },
    { value: '4', label: '4 Camere' },
    { value: '5', label: '5 Camere' },
    { value: '6+', label: '6+ Camere' }
  ],

  // Bathrooms
  bathrooms: [
    { value: '1', label: '1 Bagno' },
    { value: '2', label: '2 Bagni' },
    { value: '3', label: '3 Bagni' },
    { value: '4', label: '4 Bagni' },
    { value: '5+', label: '5+ Bagni' }
  ],

  // Area ranges (square meters)
  areaRanges: {
    min: [
      { value: '30', label: '30 mq' },
      { value: '50', label: '50 mq' },
      { value: '70', label: '70 mq' },
      { value: '90', label: '90 mq' },
      { value: '120', label: '120 mq' },
      { value: '150', label: '150 mq' },
      { value: '200', label: '200 mq' },
      { value: '300', label: '300 mq' }
    ],
    max: [
      { value: '50', label: '50 mq' },
      { value: '70', label: '70 mq' },
      { value: '90', label: '90 mq' },
      { value: '120', label: '120 mq' },
      { value: '150', label: '150 mq' },
      { value: '200', label: '200 mq' },
      { value: '300', label: '300 mq' },
      { value: '500', label: '500 mq' },
      { value: '1000+', label: '1000+ mq' }
    ]
  },

  // Price ranges (euros)
  priceRanges: {
    min: [
      { value: '50000', label: '50.000 €' },
      { value: '100000', label: '100.000 €' },
      { value: '150000', label: '150.000 €' },
      { value: '200000', label: '200.000 €' },
      { value: '300000', label: '300.000 €' },
      { value: '500000', label: '500.000 €' },
      { value: '750000', label: '750.000 €' },
      { value: '1000000', label: '1.000.000 €' }
    ],
    max: [
      { value: '100000', label: '100.000 €' },
      { value: '150000', label: '150.000 €' },
      { value: '200000', label: '200.000 €' },
      { value: '300000', label: '300.000 €' },
      { value: '500000', label: '500.000 €' },
      { value: '750000', label: '750.000 €' },
      { value: '1000000', label: '1.000.000 €' },
      { value: '2000000', label: '2.000.000 €' },
      { value: '5000000+', label: '5.000.000+ €' }
    ]
  },

  // Special zones (premium areas)
  specialZones: [
    { value: 'dolomiti', label: 'Dolomiti' },
    { value: 'lago-di-garda', label: 'Lago di Garda' },
    { value: 'terre-del-prosecco', label: 'Terre del Prosecco' },
    { value: 'costa-adriatica', label: 'Costa Adriatica' },
    { value: 'riviera-ligure', label: 'Riviera Ligure' },
    { value: 'toscana-del-chianti', label: 'Toscana del Chianti' },
    { value: 'umbria-verde', label: 'Umbria Verde' },
    { value: 'sicilia-orientale', label: 'Sicilia Orientale' },
    { value: 'sardegna-costa-smeralda', label: 'Sardegna Costa Smeralda' },
    { value: 'campania-felix', label: 'Campania Felix' },
    { value: 'puglia-salentina', label: 'Puglia Salentina' },
    { value: 'marche-picene', label: 'Marche Picene' },
    { value: 'abruzzo-montano', label: 'Abruzzo Montano' },
    { value: 'lazio-dei-castelli', label: 'Lazio dei Castelli' },
    { value: 'investimenti-estero', label: 'Investimenti all\'estero' }
  ],

  // Landmarks/Points of Interest
  landmarks: [
    { value: 'centro-storico', label: 'Centro Storico' },
    { value: 'stazione', label: 'Vicino Stazione' },
    { value: 'metro', label: 'Vicino Metro' },
    { value: 'università', label: 'Zona Universitaria' },
    { value: 'parco', label: 'Vicino Parco' },
    { value: 'mare', label: 'Vista Mare' },
    { value: 'lago', label: 'Vista Lago' },
    { value: 'montagna', label: 'Vista Montagna' },
    { value: 'aeroporto', label: 'Vicino Aeroporto' },
    { value: 'shopping', label: 'Zona Shopping' },
    { value: 'ospedale', label: 'Vicino Ospedale' },
    { value: 'scuole', label: 'Vicino Scuole' },
    { value: 'teatro', label: 'Vicino Teatro' },
    { value: 'museo', label: 'Vicino Museo' },
    { value: 'golf', label: 'Vicino Golf' },
    { value: 'spiaggia', label: 'Vicino Spiaggia' }
  ],

  // Property Features
  features: [
    { value: 'parking', label: 'Posto Auto' },
    { value: 'garage', label: 'Garage' },
    { value: 'garden', label: 'Giardino' },
    { value: 'balcony', label: 'Balcone' },
    { value: 'terrace', label: 'Terrazza' },
    { value: 'elevator', label: 'Ascensore' },
    { value: 'furnished', label: 'Arredato' },
    { value: 'air-conditioning', label: 'Aria Condizionata' },
    { value: 'fireplace', label: 'Camino' },
    { value: 'pool', label: 'Piscina' },
    { value: 'jacuzzi', label: 'Jacuzzi' },
    { value: 'gym', label: 'Palestra' },
    { value: 'sauna', label: 'Sauna' },
    { value: 'wine-cellar', label: 'Cantina' },
    { value: 'study', label: 'Studio' },
    { value: 'walk-in-closet', label: 'Cabina Armadio' },
    { value: 'security-system', label: 'Sistema di Sicurezza' },
    { value: 'smart-home', label: 'Casa Intelligente' },
    { value: 'solar-panels', label: 'Pannelli Solari' },
    { value: 'double-glazing', label: 'Doppi Vetri' }
  ],

  // Building Amenities
  amenities: [
    { value: 'concierge', label: 'Portineria' },
    { value: 'security', label: 'Sicurezza 24h' },
    { value: 'common-garden', label: 'Giardino Condominiale' },
    { value: 'common-pool', label: 'Piscina Condominiale' },
    { value: 'common-gym', label: 'Palestra Condominiale' },
    { value: 'common-terrace', label: 'Terrazza Condominiale' },
    { value: 'bike-storage', label: 'Deposito Bici' },
    { value: 'storage-room', label: 'Deposito' },
    { value: 'laundry-room', label: 'Lavanderia' },
    { value: 'meeting-room', label: 'Sala Riunioni' },
    { value: 'playground', label: 'Area Giochi' },
    { value: 'pet-area', label: 'Area Cani' }
  ],

  // Energy Ratings
  energyRatings: [
    { value: 'A4', label: 'A4' },
    { value: 'A3', label: 'A3' },
    { value: 'A2', label: 'A2' },
    { value: 'A1', label: 'A1' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' },
    { value: 'non-specificato', label: 'Non Specificato' }
  ],

  // Property Conditions
  propertyConditions: [
    { value: 'nuovo', label: 'Nuovo' },
    { value: 'ottimo', label: 'Ottimo' },
    { value: 'buono', label: 'Buono' },
    { value: 'da-ristrutturare', label: 'Da Ristrutturare' },
    { value: 'ristrutturato', label: 'Ristrutturato' },
    { value: 'in-costruzione', label: 'In Costruzione' }
  ],

  // Transport Proximity
  transportProximity: [
    { value: 'metro', label: 'Metro' },
    { value: 'bus', label: 'Autobus' },
    { value: 'tram', label: 'Tram' },
    { value: 'treno', label: 'Treno' },
    { value: 'aeroporto', label: 'Aeroporto' },
    { value: 'autostrada', label: 'Autostrada' },
    { value: 'porto', label: 'Porto' }
  ]
};

/**
 * Available filter types and their configurations
 */
export const FILTER_CONFIGURATIONS = {
  // Text/keyword search
  keyword: {
    type: 'text',
    apiField: 'keyword',
    searchFields: ['title', 'address', 'city', 'region', 'propertyType', 'id'],
    placeholder: 'Inserisci qui un indirizzo, una città o un ID proprietà'
  },
  
  // Location filters
  city: {
    type: 'multiselect',
    apiField: 'city',
    options: FILTER_OPTIONS_DATA.cities,
    placeholder: 'Tutte le città'
  },
  
  location: {
    type: 'multiselect',
    apiField: 'location',
    options: FILTER_OPTIONS_DATA.locations,
    placeholder: 'Tutte le località'
  },
  
  region: {
    type: 'multiselect',
    apiField: 'region',
    options: [], // Dynamically populated from API
    placeholder: 'Seleziona regioni'
  },
  
  zones: {
    type: 'multiselect',
    apiField: 'zones',
    options: FILTER_OPTIONS_DATA.specialZones,
    placeholder: 'Zone speciali'
  },
  
  landmarks: {
    type: 'multiselect',
    apiField: 'landmarks',
    options: FILTER_OPTIONS_DATA.landmarks,
    placeholder: 'Punti di interesse'
  },
  
  // Property type filters
  propertyType: {
    type: 'multiselect',
    apiField: 'propertyType',
    options: FILTER_OPTIONS_DATA.propertyTypes,
    placeholder: 'Tutti i tipi'
  },
  
  contractType: {
    type: 'multiselect',
    apiField: 'contractType',
    options: FILTER_OPTIONS_DATA.contractTypes,
    placeholder: 'Tipo contratto'
  },
  
  // Numeric filters
  bedrooms: {
    type: 'multiselect',
    apiField: 'bedrooms',
    options: FILTER_OPTIONS_DATA.bedrooms,
    placeholder: 'Camere'
  },
  
  bathrooms: {
    type: 'multiselect',
    apiField: 'bathrooms',
    options: FILTER_OPTIONS_DATA.bathrooms,
    placeholder: 'Bagni'
  },
  
  // Area filters
  areaMin: {
    type: 'multiselect',
    apiField: 'area',
    rangeType: 'min',
    options: FILTER_OPTIONS_DATA.areaRanges.min,
    unit: 'sqm',
    placeholder: 'Superficie Min.'
  },
  
  areaMax: {
    type: 'multiselect',
    apiField: 'area',
    rangeType: 'max',
    options: FILTER_OPTIONS_DATA.areaRanges.max,
    unit: 'sqm',
    placeholder: 'Superficie Max.'
  },
  
  // Price filters
  priceMin: {
    type: 'range',
    apiField: 'price',
    rangeType: 'min',
    currency: 'EUR',
    placeholder: 'Prezzo minimo'
  },
  
  priceMax: {
    type: 'range',
    apiField: 'price',
    rangeType: 'max',
    currency: 'EUR',
    placeholder: 'Prezzo massimo'
  },
  
  // Advanced filters
  yearBuilt: {
    type: 'range',
    apiField: 'yearBuilt',
    placeholder: 'Anno di costruzione'
  },
  
  yearMin: {
    type: 'range',
    apiField: 'yearBuilt',
    rangeType: 'min',
    placeholder: 'Anno minimo'
  },
  
  yearMax: {
    type: 'range',
    apiField: 'yearBuilt',
    rangeType: 'max',
    placeholder: 'Anno massimo'
  },
  
  features: {
    type: 'multiselect',
    apiField: 'features',
    options: FILTER_OPTIONS_DATA.features,
    placeholder: 'Caratteristiche'
  },
  
  amenities: {
    type: 'multiselect',
    apiField: 'amenities',
    options: FILTER_OPTIONS_DATA.amenities,
    placeholder: 'Servizi condominiali'
  },
  
  energyRating: {
    type: 'multiselect',
    apiField: 'energyRating',
    options: FILTER_OPTIONS_DATA.energyRatings,
    placeholder: 'Classe energetica'
  },
  
  propertyCondition: {
    type: 'select',
    apiField: 'propertyCondition',
    options: FILTER_OPTIONS_DATA.propertyConditions,
    placeholder: 'Condizioni immobile'
  },
  
  transportProximity: {
    type: 'multiselect',
    apiField: 'transportProximity',
    options: FILTER_OPTIONS_DATA.transportProximity,
    placeholder: 'Trasporti'
  }
};

// =============================================================================
// SORTING CONFIGURATION
// =============================================================================

/**
 * Available sorting options
 */
export const SORT_OPTIONS = {
  default: {
    label: 'Default',
    apiField: 'default',
    direction: 'desc'
  },
  price_asc: {
    label: 'Price: Low to High',
    apiField: 'price',
    direction: 'asc'
  },
  price_desc: {
    label: 'Price: High to Low',
    apiField: 'price',
    direction: 'desc'
  },
  area_asc: {
    label: 'Area: Small to Large',
    apiField: 'area',
    direction: 'asc'
  },
  area_desc: {
    label: 'Area: Large to Small',
    apiField: 'area',
    direction: 'desc'
  },
  bedrooms_asc: {
    label: 'Bedrooms: Fewer to More',
    apiField: 'bedrooms',
    direction: 'asc'
  },
  bedrooms_desc: {
    label: 'Bedrooms: More to Fewer',
    apiField: 'bedrooms',
    direction: 'desc'
  },
  newest: {
    label: 'Newest First',
    apiField: 'createdAt',
    direction: 'desc'
  },
  featured: {
    label: 'Featured First',
    apiField: 'featured',
    direction: 'desc'
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get value from object using dot notation path
 * @param {Object} obj - The object to search
 * @param {string} path - The dot notation path (e.g., 'coordinates.lat')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} The value at the path or default value
 */
export function getValueByPath(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Set value in object using dot notation path
 * @param {Object} obj - The object to modify
 * @param {string} path - The dot notation path
 * @param {*} value - The value to set
 */
export function setValueByPath(obj, path, value) {
  if (!obj || !path) return;
  
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

/**
 * Transform external API data to internal property format
 * @param {Object} apiData - Raw data from external API
 * @returns {Object} Transformed property object
 */
export function transformApiToProperty(apiData) {
  if (!apiData) return null;
  
  const property = {};
  
  // Map all fields using the mapping configuration
  for (const [internalField, apiPath] of Object.entries(PROPERTY_FIELD_MAPPINGS)) {
    if (typeof apiPath === 'object') {
      // Handle nested objects
      property[internalField] = {};
      for (const [nestedField, nestedPath] of Object.entries(apiPath)) {
        property[internalField][nestedField] = getValueByPath(apiData, nestedPath);
      }
    } else {
      property[internalField] = getValueByPath(apiData, apiPath);
    }
  }
  
  return property;
}

/**
 * Transform internal property format to external API format
 * @param {Object} property - Internal property object
 * @returns {Object} Transformed API data
 */
export function transformPropertyToApi(property) {
  if (!property) return null;
  
  const apiData = {};
  
  // Reverse map all fields
  for (const [internalField, apiPath] of Object.entries(PROPERTY_FIELD_MAPPINGS)) {
    if (typeof apiPath === 'object') {
      // Handle nested objects
      for (const [nestedField, nestedPath] of Object.entries(apiPath)) {
        const value = getValueByPath(property, `${internalField}.${nestedField}`);
        if (value !== null) {
          setValueByPath(apiData, nestedPath, value);
        }
      }
    } else {
      const value = getValueByPath(property, internalField);
      if (value !== null) {
        setValueByPath(apiData, apiPath, value);
      }
    }
  }
  
  return apiData;
}

/**
 * Build query parameters for API requests based on filters
 * @param {Object} filters - Filter object
 * @returns {Object} Query parameters for API
 */
export function buildApiQuery(filters) {
  const query = {};
  
  for (const [filterKey, filterValue] of Object.entries(filters)) {
    const config = FILTER_CONFIGURATIONS[filterKey];
    if (config && filterValue) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        query[config.apiField] = filterValue;
      } else if (!Array.isArray(filterValue) && filterValue !== '') {
        query[config.apiField] = filterValue;
      }
    }
  }
  
  return query;
}

/**
 * Format display value based on field type
 * @param {*} value - The value to format
 * @param {string} fieldType - The type of field (price, area, etc.)
 * @returns {string} Formatted display value
 */
export function formatDisplayValue(value, fieldType) {
  if (value === null || value === undefined) return '';
  
  switch (fieldType) {
    case 'price':
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
      
    case 'area':
      return `${value.toLocaleString('it-IT')} m²`;
      
    case 'number':
      return value.toLocaleString('it-IT');
      
    default:
      return String(value);
  }
}

// =============================================================================
// EXPORT DEFAULT CONFIGURATION
// =============================================================================

export default {
  API_CONFIG,
  PROPERTY_FIELD_MAPPINGS,
  FILTER_CONFIGURATIONS,
  FILTER_OPTIONS_DATA,
  SORT_OPTIONS,
  getValueByPath,
  setValueByPath,
  transformApiToProperty,
  transformPropertyToApi,
  buildApiQuery,
  formatDisplayValue
};