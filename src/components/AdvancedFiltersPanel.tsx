import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import SearchableMultiSelect from './SearchableMultiSelect';
import { FILTER_OPTIONS_DATA } from '../config/apiMappings.js';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilterState) => void;
  onClear: () => void;
  initialFilters?: AdvancedFilterState;
}

export interface AdvancedFilterState {
  priceMin: string;
  priceMax: string;
  propertyType: string[]; // Multi-select property types
  bedrooms: string;
  bathrooms: string;
  area: string;
  areaMax: string;
  location: string[]; // Multi-select cities
  zones: string[]; // Multi-select zones
  contractType: string;
  yearMin: string;
  yearMax: string;
  features: string[];
  amenities: string[];
  energyRating: string[];
  propertyCondition: string;
  schoolDistrict: string;
  transportProximity: string[];
}

const defaultFilters: AdvancedFilterState = {
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

const AdvancedFiltersPanel: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialFilters = defaultFilters
}) => {
  const [filters, setFilters] = useState<AdvancedFilterState>(initialFilters);

  const handleInputChange = (key: keyof AdvancedFilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelectChange = (key: keyof AdvancedFilterState, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
    }));
  };

  const handleArrayChange = (key: keyof AdvancedFilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  // Use centralized filter options from API mappings
  const cityOptions = FILTER_OPTIONS_DATA.cities;
  const zoneOptions = FILTER_OPTIONS_DATA.specialZones;
  const propertyTypeOptions = FILTER_OPTIONS_DATA.propertyTypes;
  const featuresOptions = FILTER_OPTIONS_DATA.features;
  const amenitiesOptions = FILTER_OPTIONS_DATA.amenities;
  const energyRatingOptions = FILTER_OPTIONS_DATA.energyRatings;
  const propertyConditionOptions = FILTER_OPTIONS_DATA.propertyConditions;
  const transportProximityOptions = FILTER_OPTIONS_DATA.transportProximity;

  const handleApply = (e?: React.MouseEvent | React.FormEvent) => {
    // Comprehensive event prevention to avoid any form submission or navigation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Add debug logging to track the event
    console.log('AdvancedFilters - Apply button clicked, event:', e);
    console.log('AdvancedFilters - Applying filters:', filters);
    
    try {
      onApply(filters);
      onClose();
      console.log('AdvancedFilters - Filters applied successfully');
    } catch (error) {
      console.error('AdvancedFilters - Error applying filters:', error);
    }
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    onClear();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Filtri Avanzati</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto p-6 space-y-6">
          
          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Fascia di Prezzo</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min €"
                value={filters.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max €"
                value={filters.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Building Year */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Anno di Costruzione</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Dal"
                value={filters.yearMin}
                onChange={(e) => handleInputChange('yearMin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Al"
                value={filters.yearMax}
                onChange={(e) => handleInputChange('yearMax', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Cities/Location - Multi-select */}
          <div className="space-y-3" style={{ position: 'relative', zIndex: 50 }}>
            <SearchableMultiSelect
              label="Tutte le città"
              placeholder="Seleziona città"
              options={cityOptions}
              selectedValues={filters.location}
              onSelectionChange={(values) => handleMultiSelectChange('location', values)}
              className="w-full"
            />
          </div>

          {/* Zones - Multi-select */}
          <div className="space-y-3" style={{ position: 'relative', zIndex: 40 }}>
            <SearchableMultiSelect
              label="Le nostre zone"
              placeholder="Seleziona zone"
              options={zoneOptions}
              selectedValues={filters.zones}
              onSelectionChange={(values) => handleMultiSelectChange('zones', values)}
              className="w-full"
            />
          </div>

          {/* Property Type - Multi-select */}
          <div className="space-y-3" style={{ position: 'relative', zIndex: 30 }}>
            <SearchableMultiSelect
              label="Tipologia"
              placeholder="Seleziona tipologie"
              options={propertyTypeOptions}
              selectedValues={filters.propertyType}
              onSelectionChange={(values) => {
                console.log('Property Type selection changed:', values);
                handleMultiSelectChange('propertyType', values);
              }}
              className="w-full"
            />
          </div>

          {/* Contract Type */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Contratto</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleInputChange('contractType', 'vendita')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.contractType === 'vendita'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                Vendita
              </button>
              <button
                onClick={() => handleInputChange('contractType', 'affitto')}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  filters.contractType === 'affitto'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                Affitto
              </button>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Camere da Letto</h3>
            <div className="grid grid-cols-5 gap-2">
              {['1', '2', '3', '4', '5+'].map(bedrooms => (
                <button
                  key={bedrooms}
                  onClick={() => handleInputChange('bedrooms', bedrooms)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.bedrooms === bedrooms
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {bedrooms}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Bagni</h3>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2', '3', '4+'].map(bathrooms => (
                <button
                  key={bathrooms}
                  onClick={() => handleInputChange('bathrooms', bathrooms)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.bathrooms === bathrooms
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {bathrooms}
                </button>
              ))}
            </div>
          </div>

          {/* Property Size */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Superficie (mq)</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min mq"
                value={filters.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="number"
                placeholder="Max mq"
                value={filters.areaMax}
                onChange={(e) => handleInputChange('areaMax', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Energy Rating */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Classe Energetica</h3>
            <div className="grid grid-cols-4 gap-2">
              {energyRatingOptions.map(rating => (
                <button
                  key={rating.value}
                  onClick={() => handleArrayChange('energyRating', rating.value)}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-colors
                    ${filters.energyRating.includes(rating.value)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }
                  `}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Condition */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Condizioni</h3>
            <select
              value={filters.propertyCondition}
              onChange={(e) => handleInputChange('propertyCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="">Tutte le condizioni</option>
              {propertyConditionOptions.map(condition => (
                <option key={condition.value} value={condition.value}>{condition.label}</option>
              ))}
            </select>
          </div>

          {/* Property Features */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Caratteristiche</h3>
            <div className="grid grid-cols-2 gap-2">
              {featuresOptions.map(feature => (
                <label
                  key={feature.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.value)}
                    onChange={() => handleArrayChange('features', feature.value)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Servizi</h3>
            <div className="grid grid-cols-1 gap-2">
              {amenitiesOptions.map(amenity => (
                <label
                  key={amenity.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={() => handleArrayChange('amenities', amenity.value)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* School District */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Zona Scolastica</h3>
            <select
              value={filters.schoolDistrict}
              onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="">Qualsiasi zona</option>
              <option value="centro">Centro Storico</option>
              <option value="semicentro">Semicentro</option>
              <option value="periferia">Periferia</option>
              <option value="provincia">Provincia</option>
            </select>
          </div>

          {/* Transportation */}
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Vicinanza Trasporti</h3>
            <div className="grid grid-cols-1 gap-2">
              {transportProximityOptions.map(transport => (
                <label
                  key={transport.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.transportProximity.includes(transport.value)}
                    onChange={() => handleArrayChange('transportProximity', transport.value)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{transport.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancella
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleApply(e);
              }}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-button-hover transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Applica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersPanel;
