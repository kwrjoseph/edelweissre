import React, { useState } from 'react';
import { X } from 'lucide-react';
import SearchableMultiSelect from './SearchableMultiSelect';
import filtersData from '../data/filters.json';
import { Button } from './Button';
import { AdvancedFilterState } from './AdvancedFiltersPanel';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
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
  onApply: () => void;
  onClear: () => void;
  onAdvancedFiltersApply?: (filters: AdvancedFilterState) => void;
  onAdvancedFiltersClear?: () => void;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onClear,
  onAdvancedFiltersApply,
  onAdvancedFiltersClear
}) => {
  // Advanced filter state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
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
  });

  const handleMultiSelectChange = (key: string) => (values: string[]) => {
    onFilterChange(key, values);
  };

  const handleAdvancedFilterChange = (key: keyof AdvancedFilterState, value: string | string[]) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAdvancedArrayChange = (key: keyof AdvancedFilterState, value: string) => {
    setAdvancedFilters(prev => {
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

  const getActiveFiltersCount = () => {
    const basicCounts = {
      location: filters.location.length,
      city: filters.city.length,
      propertyType: filters.propertyType.length,
      contractType: filters.contractType.length,
      bedrooms: filters.bedrooms.length,
      bathrooms: filters.bathrooms.length,
      area: filters.areaMin.length + filters.areaMax.length
    };
    
    const advancedCounts = {
      price: (advancedFilters.priceMin || advancedFilters.priceMax) ? 1 : 0,
      year: (advancedFilters.yearMin || advancedFilters.yearMax) ? 1 : 0,
      zones: advancedFilters.zones.length,
      features: advancedFilters.features.length,
      amenities: advancedFilters.amenities.length,
      energyRating: advancedFilters.energyRating.length,
      condition: advancedFilters.propertyCondition ? 1 : 0,
      school: advancedFilters.schoolDistrict ? 1 : 0,
      transport: advancedFilters.transportProximity.length
    };
    
    return Object.values(basicCounts).reduce((sum, count) => sum + count, 0) +
           Object.values(advancedCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleApply = () => {
    // Apply advanced filters first if there are any
    if (onAdvancedFiltersApply) {
      onAdvancedFiltersApply(advancedFilters);
    }
    onApply();
    onClose();
  };

  const handleClear = () => {
    // Clear advanced filters
    if (onAdvancedFiltersClear) {
      onAdvancedFiltersClear();
    }
    onClear();
    setAdvancedFilters({
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
    });
  };

  // Options data
  const cityOptions = [
    { value: 'Milano', label: 'Milano' },
    { value: 'Roma', label: 'Roma' },
    { value: 'Napoli', label: 'Napoli' },
    { value: 'Torino', label: 'Torino' },
    { value: 'Palermo', label: 'Palermo' },
    { value: 'Genova', label: 'Genova' },
    { value: 'Bologna', label: 'Bologna' },
    { value: 'Firenze', label: 'Firenze' },
    { value: 'Bari', label: 'Bari' },
    { value: 'Catania', label: 'Catania' },
    { value: 'Venezia', label: 'Venezia' },
    { value: 'Verona', label: 'Verona' },
    { value: 'Messina', label: 'Messina' },
    { value: 'Padova', label: 'Padova' },
    { value: 'Trieste', label: 'Trieste' },
    { value: 'Brescia', label: 'Brescia' },
    { value: 'Taranto', label: 'Taranto' },
    { value: 'Prato', label: 'Prato' },
    { value: 'Modena', label: 'Modena' },
    { value: 'Reggio Calabria', label: 'Reggio Calabria' }
  ];

  const zoneOptions = [
    { value: 'Dolomiti', label: 'Dolomiti' },
    { value: 'Investimenti all\'estero', label: 'Investimenti all\'estero' },
    { value: 'Lago di Garda', label: 'Lago di Garda' },
    { value: 'Terre del Prosecco', label: 'Terre del Prosecco' },
    { value: 'Costa Adriatica', label: 'Costa Adriatica' },
    { value: 'Riviera Ligure', label: 'Riviera Ligure' },
    { value: 'Toscana del Chianti', label: 'Toscana del Chianti' },
    { value: 'Umbria Verde', label: 'Umbria Verde' },
    { value: 'Sicilia Orientale', label: 'Sicilia Orientale' },
    { value: 'Sardegna Costa Smeralda', label: 'Sardegna Costa Smeralda' },
    { value: 'Campania Felix', label: 'Campania Felix' },
    { value: 'Puglia Salentina', label: 'Puglia Salentina' },
    { value: 'Marche Picene', label: 'Marche Picene' },
    { value: 'Abruzzo Montano', label: 'Abruzzo Montano' },
    { value: 'Lazio dei Castelli', label: 'Lazio dei Castelli' }
  ];

  const propertyTypeOptions = [
    { value: 'Appartamento', label: 'Appartamento' },
    { value: 'Az. agricola', label: 'Az. agricola' },
    { value: 'Baita', label: 'Baita' },
    { value: 'Bifamiliare', label: 'Bifamiliare' },
    { value: 'Casa a schiera', label: 'Casa a schiera' },
    { value: 'Casa indipendente', label: 'Casa indipendente' },
    { value: 'Castello', label: 'Castello' },
    { value: 'Loft', label: 'Loft' },
    { value: 'Mansarda', label: 'Mansarda' },
    { value: 'Rustico', label: 'Rustico' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Attico', label: 'Attico' },
    { value: 'Palazzo', label: 'Palazzo' },
    { value: 'Cascina', label: 'Cascina' },
    { value: 'Masseria', label: 'Masseria' },
    { value: 'Trullo', label: 'Trullo' },
    { value: 'Chalet', label: 'Chalet' },
    { value: 'Dimora storica', label: 'Dimora storica' },
    { value: 'Casa di campagna', label: 'Casa di campagna' },
    { value: 'Casa al mare', label: 'Casa al mare' }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden" 
        onClick={onClose}
      />
      
      {/* Filter Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-900">Filtri</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#e3ae61] text-white text-sm font-medium px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            
            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Fascia di Prezzo</h3>
                {(advancedFilters.priceMin || advancedFilters.priceMax) && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    1
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min €"
                  value={advancedFilters.priceMin}
                  onChange={(e) => handleAdvancedFilterChange('priceMin', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                />
                <input
                  type="number"
                  placeholder="Max €"
                  value={advancedFilters.priceMax}
                  onChange={(e) => handleAdvancedFilterChange('priceMax', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Località</h3>
                {(filters.location.length + filters.city.length + advancedFilters.zones.length) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {filters.location.length + filters.city.length + advancedFilters.zones.length}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <SearchableMultiSelect
                  options={filtersData.cities.slice(1)}
                  selectedValues={filters.city}
                  onSelectionChange={handleMultiSelectChange('city')}
                  placeholder="Tutte le città"
                  className="h-12"
                />
                <SearchableMultiSelect
                  options={filtersData.locations.slice(1)}
                  selectedValues={filters.location}
                  onSelectionChange={handleMultiSelectChange('location')}
                  placeholder="Tutte le località"
                  className="h-12"
                />
                <SearchableMultiSelect
                  options={zoneOptions}
                  selectedValues={advancedFilters.zones}
                  onSelectionChange={(values) => handleAdvancedFilterChange('zones', values)}
                  placeholder="Seleziona zone"
                  className="h-12"
                />
              </div>
            </div>

            {/* Property Type & Contract */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Tipo di Proprietà</h3>
                {(filters.propertyType.length + filters.contractType.length + (advancedFilters.contractType ? 1 : 0)) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {filters.propertyType.length + filters.contractType.length + (advancedFilters.contractType ? 1 : 0)}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Contratto</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAdvancedFilterChange('contractType', 'vendita')}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        advancedFilters.contractType === 'vendita'
                          ? 'bg-[#e3ae61] text-white border-[#e3ae61]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#e3ae61]'
                      }`}
                    >
                      Vendita
                    </button>
                    <button
                      onClick={() => handleAdvancedFilterChange('contractType', 'affitto')}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        advancedFilters.contractType === 'affitto'
                          ? 'bg-[#e3ae61] text-white border-[#e3ae61]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#e3ae61]'
                      }`}
                    >
                      Affitto
                    </button>
                  </div>
                </div>
                
                <SearchableMultiSelect
                  options={propertyTypeOptions}
                  selectedValues={filters.propertyType}
                  onSelectionChange={handleMultiSelectChange('propertyType')}
                  placeholder="Tutti i tipi"
                  className="h-12"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Camere e Bagni</h3>
                {(filters.bedrooms.length + filters.bathrooms.length + (advancedFilters.bedrooms ? 1 : 0) + (advancedFilters.bathrooms ? 1 : 0)) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {filters.bedrooms.length + filters.bathrooms.length + (advancedFilters.bedrooms ? 1 : 0) + (advancedFilters.bathrooms ? 1 : 0)}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Camere da Letto</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {['1', '2', '3', '4', '5+'].map(bedrooms => (
                      <button
                        key={bedrooms}
                        onClick={() => handleAdvancedFilterChange('bedrooms', bedrooms)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          advancedFilters.bedrooms === bedrooms
                            ? 'bg-[#e3ae61] text-white border-[#e3ae61]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#e3ae61]'
                        }`}
                      >
                        {bedrooms}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Bagni</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map(bathrooms => (
                      <button
                        key={bathrooms}
                        onClick={() => handleAdvancedFilterChange('bathrooms', bathrooms)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          advancedFilters.bathrooms === bathrooms
                            ? 'bg-[#e3ae61] text-white border-[#e3ae61]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#e3ae61]'
                        }`}
                      >
                        {bathrooms}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Area & Building Year */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Superficie & Anno</h3>
                {(filters.areaMin.length + filters.areaMax.length + (advancedFilters.area || advancedFilters.areaMax || advancedFilters.yearMin || advancedFilters.yearMax ? 1 : 0)) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {filters.areaMin.length + filters.areaMax.length + (advancedFilters.area || advancedFilters.areaMax || advancedFilters.yearMin || advancedFilters.yearMax ? 1 : 0)}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Superficie (mq)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min mq"
                      value={advancedFilters.area}
                      onChange={(e) => handleAdvancedFilterChange('area', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                    />
                    <input
                      type="number"
                      placeholder="Max mq"
                      value={advancedFilters.areaMax}
                      onChange={(e) => handleAdvancedFilterChange('areaMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Anno di Costruzione</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Dal"
                      value={advancedFilters.yearMin}
                      onChange={(e) => handleAdvancedFilterChange('yearMin', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                    />
                    <input
                      type="number"
                      placeholder="Al"
                      value={advancedFilters.yearMax}
                      onChange={(e) => handleAdvancedFilterChange('yearMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Rating & Condition */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Classe & Condizioni</h3>
                {(advancedFilters.energyRating.length + (advancedFilters.propertyCondition ? 1 : 0)) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {advancedFilters.energyRating.length + (advancedFilters.propertyCondition ? 1 : 0)}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Classe Energetica</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleAdvancedArrayChange('energyRating', rating)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          advancedFilters.energyRating.includes(rating)
                            ? 'bg-[#e3ae61] text-white border-[#e3ae61]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#e3ae61]'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Condizioni</h4>
                  <select
                    value={advancedFilters.propertyCondition}
                    onChange={(e) => handleAdvancedFilterChange('propertyCondition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                  >
                    <option value="">Tutte le condizioni</option>
                    <option value="nuovo">Nuovo</option>
                    <option value="ristrutturato">Ristrutturato</option>
                    <option value="buono">Buono stato</option>
                    <option value="discreto">Discreto</option>
                    <option value="da_ristrutturare">Da ristrutturare</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Caratteristiche & Servizi</h3>
                {(advancedFilters.features.length + advancedFilters.amenities.length) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {advancedFilters.features.length + advancedFilters.amenities.length}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Caratteristiche</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'piscina', label: 'Piscina' },
                      { value: 'garage', label: 'Garage' },
                      { value: 'giardino', label: 'Giardino' },
                      { value: 'terrazza', label: 'Terrazza' },
                      { value: 'balcone', label: 'Balcone' },
                      { value: 'cantina', label: 'Cantina' },
                      { value: 'soffitta', label: 'Soffitta' },
                      { value: 'ascensore', label: 'Ascensore' }
                    ].map(feature => (
                      <label
                        key={feature.value}
                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={advancedFilters.features.includes(feature.value)}
                          onChange={() => handleAdvancedArrayChange('features', feature.value)}
                          className="rounded border-gray-300 text-[#e3ae61] focus:ring-[#e3ae61]"
                        />
                        <span className="text-sm text-gray-700">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Servizi</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: 'aria_condizionata', label: 'Aria Condizionata' },
                      { value: 'riscaldamento_autonomo', label: 'Riscaldamento Autonomo' },
                      { value: 'camino', label: 'Camino' },
                      { value: 'fibra_ottica', label: 'Fibra Ottica' },
                      { value: 'videosorveglianza', label: 'Videosorveglianza' },
                      { value: 'portineria', label: 'Portineria' }
                    ].map(amenity => (
                      <label
                        key={amenity.value}
                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={advancedFilters.amenities.includes(amenity.value)}
                          onChange={() => handleAdvancedArrayChange('amenities', amenity.value)}
                          className="rounded border-gray-300 text-[#e3ae61] focus:ring-[#e3ae61]"
                        />
                        <span className="text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Filtri Aggiuntivi</h3>
                {((advancedFilters.schoolDistrict ? 1 : 0) + advancedFilters.transportProximity.length) > 0 && (
                  <span className="bg-[#e3ae61] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {(advancedFilters.schoolDistrict ? 1 : 0) + advancedFilters.transportProximity.length}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Zona Scolastica</h4>
                  <select
                    value={advancedFilters.schoolDistrict}
                    onChange={(e) => handleAdvancedFilterChange('schoolDistrict', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e3ae61]"
                  >
                    <option value="">Qualsiasi zona</option>
                    <option value="centro">Centro Storico</option>
                    <option value="semicentro">Semicentro</option>
                    <option value="periferia">Periferia</option>
                    <option value="provincia">Provincia</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm">Vicinanza Trasporti</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: 'metro', label: 'Metropolitana (< 500m)' },
                      { value: 'autobus', label: 'Fermata Autobus (< 200m)' },
                      { value: 'treno', label: 'Stazione Treno (< 1km)' }
                    ].map(transport => (
                      <label
                        key={transport.value}
                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={advancedFilters.transportProximity.includes(transport.value)}
                          onChange={() => handleAdvancedArrayChange('transportProximity', transport.value)}
                          className="rounded border-gray-300 text-[#e3ae61] focus:ring-[#e3ae61]"
                        />
                        <span className="text-sm text-gray-700">{transport.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3 flex-shrink-0">
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleClear}
              className="flex-1 h-12 text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancella Tutto
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 h-12 bg-[#e3ae61] hover:bg-[#d89f4e] text-white font-semibold"
            >
              Applica Filtri {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterSheet;