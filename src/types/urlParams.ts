/**
 * Type definitions for URL parameter handling
 */

export interface UrlFilterParams {
  search?: string;
  city?: string;
  location?: string;
  type?: string;
  contract?: string;
  bedrooms?: string;
  bathrooms?: string;
  areaMin?: string;
  areaMax?: string;
  priceMin?: string;
  priceMax?: string;
  zones?: string;
  yearMin?: string;
  yearMax?: string;
  features?: string;
  amenities?: string;
  energyRating?: string;
  propertyCondition?: string;
  schoolDistrict?: string;
  transportProximity?: string;
}

export interface SearchState {
  hasFilters: boolean;
  isFromUrl: boolean;
  lastUpdated: number;
}

export interface UrlSyncConfig {
  enableUrlSync: boolean;
  replaceState: boolean;
  debounceMs: number;
}

export interface ShareableUrlOptions {
  includeAdvancedFilters: boolean;
  shortUrl: boolean;
  baseUrl?: string;
}