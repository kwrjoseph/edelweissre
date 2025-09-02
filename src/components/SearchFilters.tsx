import React from 'react';
import { Search, Bell, Filter } from 'lucide-react';
import SearchableMultiSelect from './SearchableMultiSelect';
import { FILTER_OPTIONS_DATA } from '../config/apiMappings.js';

interface SearchFiltersProps {
  filters: {
    keyword: string;
    location: string[];
    city: string[];
    propertyType: string[];
    contractType: string[];
    bedrooms: string[];
    bathrooms: string[];
    areaMin: string[];
    areaMax: string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  onSearch: () => void;
  onAdvancedFiltersOpen?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onAdvancedFiltersOpen
}) => {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('keyword', e.target.value);
  };

  const handleMultiSelectChange = (key: string) => (values: string[]) => {
    onFilterChange(key, values);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  // Use centralized filter options from API mappings
  const cityOptions = FILTER_OPTIONS_DATA.cities;
  const locationOptions = FILTER_OPTIONS_DATA.locations;
  const propertyTypeOptions = FILTER_OPTIONS_DATA.propertyTypes;
  const contractTypeOptions = FILTER_OPTIONS_DATA.contractTypes;
  const bedroomOptions = FILTER_OPTIONS_DATA.bedrooms;
  const bathroomOptions = FILTER_OPTIONS_DATA.bathrooms;
  const areaMinOptions = FILTER_OPTIONS_DATA.areaRanges.min;
  const areaMaxOptions = FILTER_OPTIONS_DATA.areaRanges.max;

  return (
    <div className="bg-white p-6 shadow-lg">
      {/* Main Search Form */}
      <form onSubmit={handleSubmit}>
        {/* Top Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={filters.keyword}
              onChange={handleKeywordChange}
              placeholder="Inserisci qui un indirizzo, una città o un ID proprietà"
              className="w-full h-12 px-4 pr-12 border-2 border-form-border rounded-lg bg-white text-primary placeholder-form-text focus:outline-none focus:border-primary-button transition-colors"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text" />
          </div>
        </div>

        {/* Filter Grid - 4x2 layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Row 1 */}
          <SearchableMultiSelect
            options={cityOptions}
            selectedValues={filters.city}
            onSelectionChange={handleMultiSelectChange('city')}
            placeholder="Tutte le città"
            className="h-12"
          />

          <SearchableMultiSelect
            options={locationOptions}
            selectedValues={filters.location}
            onSelectionChange={handleMultiSelectChange('location')}
            placeholder="Tutte le località"
            className="h-12"
          />

          <SearchableMultiSelect
            options={contractTypeOptions}
            selectedValues={filters.contractType}
            onSelectionChange={handleMultiSelectChange('contractType')}
            placeholder="Contratto"
            className="h-12"
            showSearch={true}
          />

          <SearchableMultiSelect
            options={propertyTypeOptions}
            selectedValues={filters.propertyType}
            onSelectionChange={handleMultiSelectChange('propertyType')}
            placeholder="Tutti i tipi"
            className="h-12"
          />

          {/* Row 2 */}
          <SearchableMultiSelect
            options={bedroomOptions}
            selectedValues={filters.bedrooms}
            onSelectionChange={handleMultiSelectChange('bedrooms')}
            placeholder="Camere"
            className="h-12"
          />

          <SearchableMultiSelect
            options={bathroomOptions}
            selectedValues={filters.bathrooms}
            onSelectionChange={handleMultiSelectChange('bathrooms')}
            placeholder="Bagni"
            className="h-12"
          />

          <SearchableMultiSelect
            options={areaMinOptions}
            selectedValues={filters.areaMin}
            onSelectionChange={handleMultiSelectChange('areaMin')}
            placeholder="Superficie Min."
            className="h-12"
            showSearch={true}
          />

          <SearchableMultiSelect
            options={areaMaxOptions}
            selectedValues={filters.areaMax}
            onSelectionChange={handleMultiSelectChange('areaMax')}
            placeholder="Superficie Max."
            className="h-12"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 h-12 bg-primary-button border-2 border-primary-button-border text-white font-semibold rounded-lg hover:bg-primary-button-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary-button focus:ring-offset-1"
          >
            CERCA
          </button>
          <button
            type="button"
            onClick={onAdvancedFiltersOpen}
            className="flex items-center gap-2 h-12 px-4 bg-white border-2 border-form-border text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            <Filter className="w-4 h-4" />
            FILTRI
          </button>
          <button
            type="button"
            className="flex items-center gap-2 h-12 px-6 bg-secondary-button border-2 border-secondary-button-border text-white font-semibold rounded-lg hover:bg-secondary-button-hover transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-button focus:ring-offset-1"
          >
            <Bell className="w-4 h-4" />
            SALVA RICERCA
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;