/**
 * Utility functions for handling URL parameter encoding/decoding
 */

// Convert array to URL-safe string
export function arrayToUrlParam(arr: string[]): string {
  return arr.length > 0 ? arr.join(',') : '';
}

// Convert URL parameter string back to array
export function urlParamToArray(param: string | null): string[] {
  if (!param) return [];
  return param.split(',').filter(item => item.trim() !== '');
}

// Convert price range to URL parameters
export function priceRangeToUrlParams(min?: string, max?: string): { priceMin?: string; priceMax?: string } {
  const params: { priceMin?: string; priceMax?: string } = {};
  if (min && min !== '') params.priceMin = min;
  if (max && max !== '') params.priceMax = max;
  return params;
}

// Convert area range to URL parameters
export function areaRangeToUrlParams(min?: string, max?: string): { areaMin?: string; areaMax?: string } {
  const params: { areaMin?: string; areaMax?: string } = {};
  if (min && min !== '') params.areaMin = min;
  if (max && max !== '') params.areaMax = max;
  return params;
}

// Validate and sanitize URL parameters
export function sanitizeUrlParams(params: Record<string, string | string[]>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const filtered = value.filter(v => v && v.trim() !== '');
      if (filtered.length > 0) {
        sanitized[key] = filtered.join(',');
      }
    } else if (value && typeof value === 'string' && value.trim() !== '') {
      sanitized[key] = value.trim();
    }
  });
  
  return sanitized;
}

// Generate shareable URL with current filters
export function generateShareableUrl(baseUrl: string, filters: any, advancedFilters: any): string {
  const url = new URL(baseUrl);
  const params = new URLSearchParams();
  
  // Add basic filters
  if (filters.keyword) params.set('search', filters.keyword);
  if (filters.city?.length) params.set('city', filters.city.join(','));
  if (filters.location?.length) params.set('location', filters.location.join(','));
  if (filters.propertyType?.length) params.set('type', filters.propertyType.join(','));
  if (filters.contractType?.length && !filters.contractType.includes('entrambi')) {
    params.set('contract', filters.contractType.join(','));
  }
  if (filters.bedrooms?.length) params.set('bedrooms', filters.bedrooms.join(','));
  if (filters.bathrooms?.length) params.set('bathrooms', filters.bathrooms.join(','));
  if (filters.areaMin?.length) params.set('areaMin', filters.areaMin.join(','));
  if (filters.areaMax?.length) params.set('areaMax', filters.areaMax.join(','));
  
  // Add advanced filters
  if (advancedFilters.priceMin) params.set('priceMin', advancedFilters.priceMin);
  if (advancedFilters.priceMax) params.set('priceMax', advancedFilters.priceMax);
  
  url.search = params.toString();
  return url.toString();
}

// Parse incoming URL and extract filter parameters
export function parseUrlFilters(searchParams: URLSearchParams) {
  const urlParams: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    urlParams[key] = value;
  }
  
  return urlParams;
}