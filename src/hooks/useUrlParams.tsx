import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { AdvancedFilterState } from '../components/AdvancedFiltersPanel';

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

export interface UrlSearchState {
  search?: string;
  city?: string;
  type?: string;
  contract?: string;
  priceMin?: string;
  priceMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  areaMin?: string;
  areaMax?: string;
  location?: string;
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

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URL search params to filter state
  const getFiltersFromUrl = useCallback((): { filters: Filters; advancedFilters: AdvancedFilterState } => {
    const urlParams = Object.fromEntries(searchParams.entries());
    
    const filters: Filters = {
      keyword: urlParams.search || '',
      location: urlParams.location ? urlParams.location.split(',') : [],
      city: urlParams.city ? urlParams.city.split(',') : [],
      propertyType: urlParams.type ? urlParams.type.split(',') : [],
      contractType: urlParams.contract ? urlParams.contract.split(',') : ['vendita'], // Default to 'vendita'
      bedrooms: urlParams.bedrooms ? urlParams.bedrooms.split(',') : [],
      bathrooms: urlParams.bathrooms ? urlParams.bathrooms.split(',') : [],
      areaMin: urlParams.areaMin ? urlParams.areaMin.split(',') : [],
      areaMax: urlParams.areaMax ? urlParams.areaMax.split(',') : []
    };

    const advancedFilters: AdvancedFilterState = {
      priceMin: urlParams.priceMin || '',
      priceMax: urlParams.priceMax || '',
      propertyType: urlParams.type ? urlParams.type.split(',') : [],
      bedrooms: urlParams.bedrooms || '',
      bathrooms: urlParams.bathrooms || '',
      area: urlParams.areaMin || '',
      areaMax: urlParams.areaMax || '',
      location: urlParams.location ? urlParams.location.split(',') : [],
      zones: urlParams.zones ? urlParams.zones.split(',') : [],
      contractType: urlParams.contract || '',
      yearMin: urlParams.yearMin || '',
      yearMax: urlParams.yearMax || '',
      features: urlParams.features ? urlParams.features.split(',') : [],
      amenities: urlParams.amenities ? urlParams.amenities.split(',') : [],
      energyRating: urlParams.energyRating ? urlParams.energyRating.split(',') : [],
      propertyCondition: urlParams.propertyCondition || '',
      schoolDistrict: urlParams.schoolDistrict || '',
      transportProximity: urlParams.transportProximity ? urlParams.transportProximity.split(',') : [],
    };

    return { filters, advancedFilters };
  }, [searchParams]);

  // Update URL params from filter state
  const updateUrlFromFilters = useCallback((filters: Filters, advancedFilters: AdvancedFilterState) => {
    const params = new URLSearchParams();

    // Basic filters
    if (filters.keyword) {
      params.set('search', filters.keyword);
    }
    if (filters.city.length > 0) {
      params.set('city', filters.city.join(','));
    }
    if (filters.location.length > 0) {
      params.set('location', filters.location.join(','));
    }
    if (filters.propertyType.length > 0) {
      params.set('type', filters.propertyType.join(','));
    }
    if (filters.contractType.length > 0 && !filters.contractType.includes('entrambi')) {
      params.set('contract', filters.contractType.join(','));
    }
    if (filters.bedrooms.length > 0) {
      params.set('bedrooms', filters.bedrooms.join(','));
    }
    if (filters.bathrooms.length > 0) {
      params.set('bathrooms', filters.bathrooms.join(','));
    }
    if (filters.areaMin.length > 0) {
      params.set('areaMin', filters.areaMin.join(','));
    }
    if (filters.areaMax.length > 0) {
      params.set('areaMax', filters.areaMax.join(','));
    }

    // Advanced filters
    if (advancedFilters.priceMin) {
      params.set('priceMin', advancedFilters.priceMin);
    }
    if (advancedFilters.priceMax) {
      params.set('priceMax', advancedFilters.priceMax);
    }
    if (advancedFilters.propertyType.length > 0) {
      params.set('type', advancedFilters.propertyType.join(','));
    }
    if (advancedFilters.contractType) {
      params.set('contract', advancedFilters.contractType);
    }
    if (advancedFilters.bedrooms) {
      params.set('bedrooms', advancedFilters.bedrooms);
    }
    if (advancedFilters.bathrooms) {
      params.set('bathrooms', advancedFilters.bathrooms);
    }
    if (advancedFilters.area) {
      params.set('areaMin', advancedFilters.area);
    }
    if (advancedFilters.areaMax) {
      params.set('areaMax', advancedFilters.areaMax);
    }
    if (advancedFilters.location.length > 0) {
      params.set('location', advancedFilters.location.join(','));
    }
    if (advancedFilters.zones.length > 0) {
      params.set('zones', advancedFilters.zones.join(','));
    }
    if (advancedFilters.yearMin) {
      params.set('yearMin', advancedFilters.yearMin);
    }
    if (advancedFilters.yearMax) {
      params.set('yearMax', advancedFilters.yearMax);
    }
    if (advancedFilters.features.length > 0) {
      params.set('features', advancedFilters.features.join(','));
    }
    if (advancedFilters.amenities.length > 0) {
      params.set('amenities', advancedFilters.amenities.join(','));
    }
    if (advancedFilters.energyRating.length > 0) {
      params.set('energyRating', advancedFilters.energyRating.join(','));
    }
    if (advancedFilters.propertyCondition) {
      params.set('propertyCondition', advancedFilters.propertyCondition);
    }
    if (advancedFilters.schoolDistrict) {
      params.set('schoolDistrict', advancedFilters.schoolDistrict);
    }
    if (advancedFilters.transportProximity.length > 0) {
      params.set('transportProximity', advancedFilters.transportProximity.join(','));
    }

    // Update URL without navigation/reload
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Check if there are any URL parameters
  const hasUrlParams = useCallback(() => {
    return searchParams.toString().length > 0;
  }, [searchParams]);

  // Clear all URL parameters
  const clearUrlParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    getFiltersFromUrl,
    updateUrlFromFilters,
    hasUrlParams,
    clearUrlParams,
    searchParams
  };
}

export default useUrlParams;