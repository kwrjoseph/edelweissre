import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Sliders, Map, ChevronDown, Home, Bed, Bath, Euro, Loader, CheckCircle } from 'lucide-react';
import { searchProperties, getPropertySuggestions, Property, SearchFilters, SearchResult } from '../../utils/propertySearch';
import SearchableMultiSelect from '../SearchableMultiSelect';

const SearchInterfaces: React.FC = () => {
  const [advancedSearch, setAdvancedSearch] = useState({
    location: [] as string[],
    city: '',
    propertyType: [] as string[],
    contractType: [] as string[],
    bedrooms: [] as string[],
    bathrooms: [] as string[],
    minPrice: 0,
    maxPrice: 5000000
  });

  const [simpleSearch, setSimpleSearch] = useState({
    location: '',
    propertyType: [] as string[]
  });

  const [quickFilters, setQuickFilters] = useState({
    vistaLago: false,
    piscina: false,
    nuovaCostruzione: false,
    centroStorico: false
  });

  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const locations = [
    { value: 'dolomiti', label: 'Dolomiti' },
    { value: 'venezia', label: 'Venezia' },
    { value: 'prosecco', label: 'Zona del Prosecco' },
    { value: 'como', label: 'Lago di Como' },
    { value: 'garda', label: 'Lago di Garda' },
    { value: 'toscana', label: 'Toscana' }
  ];

  const propertyTypes = [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'chalet', label: 'Chalet' },
    { value: 'villa', label: 'Villa' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'attico', label: 'Attico' },
    { value: 'loft', label: 'Loft' }
  ];

  const contractTypes = [
    { value: 'vendita', label: 'In Vendita' },
    { value: 'affitto', label: 'In Affitto' },
    { value: 'trattativa', label: 'In Trattativa' },
    { value: 'venduto', label: 'Venduto' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  const bathroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  const handleAdvancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    const filters: SearchFilters = {
      location: advancedSearch.location.length > 0 ? advancedSearch.location[0] : undefined,
      city: advancedSearch.city || undefined,
      propertyType: advancedSearch.propertyType.length > 0 ? advancedSearch.propertyType[0] : undefined,
      contractType: advancedSearch.contractType.length > 0 ? advancedSearch.contractType[0] : undefined,
      minBedrooms: advancedSearch.bedrooms.length > 0 ? parseInt(advancedSearch.bedrooms[0]) : undefined,
      minBathrooms: advancedSearch.bathrooms.length > 0 ? parseInt(advancedSearch.bathrooms[0]) : undefined,
      minPrice: advancedSearch.minPrice > 0 ? advancedSearch.minPrice : undefined,
      maxPrice: advancedSearch.maxPrice < 5000000 ? advancedSearch.maxPrice : undefined
    };
    
    try {
      const results = await searchProperties(filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    const filters: SearchFilters = {
      city: simpleSearch.location || undefined,
      propertyType: simpleSearch.propertyType.length > 0 ? simpleSearch.propertyType[0] : undefined
    };
    
    try {
      const results = await searchProperties(filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [filter]: !prev[filter as keyof typeof quickFilters]
    }));
  };

  const handleQuickFiltersApply = async () => {
    setIsSearching(true);
    
    const filters: SearchFilters = {
      quickFilters
    };
    
    try {
      const results = await searchProperties(filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationInput = async (value: string, isSimple: boolean = false) => {
    if (isSimple) {
      setSimpleSearch(prev => ({ ...prev, location: value }));
    } else {
      setAdvancedSearch(prev => ({ ...prev, city: value }));
    }
    
    if (value.length > 2) {
      try {
        const suggestionList = await getPropertySuggestions(value);
        setSuggestions(suggestionList);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string, isSimple: boolean = false) => {
    if (isSimple) {
      setSimpleSearch(prev => ({ ...prev, location: suggestion }));
    } else {
      setAdvancedSearch(prev => ({ ...prev, city: suggestion }));
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-16">
      {/* Edelweiss-Style Advanced Search */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Ricerca Avanzata Stile Edelweiss</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ricerca Avanzata
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Utilizza i nostri filtri avanzati per trovare esattamente la proprietà che stai cercando nelle location più esclusive.
            </p>
          </div>
          
          <form onSubmit={handleAdvancedSubmit} className="bg-gray-50 p-8 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Location Dropdown */}
              <SearchableMultiSelect
                label="Località Principale"
                options={locations}
                selectedValues={advancedSearch.location}
                onSelectionChange={(values) => setAdvancedSearch({...advancedSearch, location: values})}
                placeholder="Seleziona una località"
                allowSelectAll={true}
                showSearch={true}
                className="h-12"
              />
              
              {/* City Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Città / Comune</label>
                <input 
                  type="text" 
                  placeholder="Es. Cortina d'Ampezzo"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  value={advancedSearch.city}
                  onChange={(e) => handleLocationInput(e.target.value, false)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => selectSuggestion(suggestion, false)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Property Type */}
              <SearchableMultiSelect
                label="Tipologia Immobile"
                options={propertyTypes}
                selectedValues={advancedSearch.propertyType}
                onSelectionChange={(values) => setAdvancedSearch({...advancedSearch, propertyType: values})}
                placeholder="Tutte le tipologie"
                allowSelectAll={true}
                showSearch={true}
                className="h-12"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Contract Type */}
              <SearchableMultiSelect
                label="Tipo di Contratto"
                options={contractTypes}
                selectedValues={advancedSearch.contractType}
                onSelectionChange={(values) => setAdvancedSearch({...advancedSearch, contractType: values})}
                placeholder="Tutti i contratti"
                allowSelectAll={true}
                showSearch={true}
                className="h-12"
              />
              
              {/* Bedrooms */}
              <SearchableMultiSelect
                label="Camere da Letto"
                options={bedroomOptions}
                selectedValues={advancedSearch.bedrooms}
                onSelectionChange={(values) => setAdvancedSearch({...advancedSearch, bedrooms: values})}
                placeholder="Qualsiasi"
                allowSelectAll={true}
                showSearch={false}
                className="h-12"
              />
              
              {/* Bathrooms */}
              <SearchableMultiSelect
                label="Bagni"
                options={bathroomOptions}
                selectedValues={advancedSearch.bathrooms}
                onSelectionChange={(values) => setAdvancedSearch({...advancedSearch, bathrooms: values})}
                placeholder="Qualsiasi"
                allowSelectAll={true}
                showSearch={false}
                className="h-12"
              />
              
              {/* Search Button */}
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-accent text-white px-6 py-3 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Ricerca...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Cerca Proprietà</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Price Range Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Fascia di Prezzo</label>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    Min: €{advancedSearch.minPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Max: €{advancedSearch.maxPrice.toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={advancedSearch.minPrice}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, minPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={advancedSearch.maxPrice}
                    onChange={(e) => setAdvancedSearch({...advancedSearch, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Simplified Search Bar */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Barra di Ricerca Semplificata</h3>
        </div>
        <div className="p-8">
          <form onSubmit={handleSimpleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 ml-3 mr-2" />
                <input 
                  type="text" 
                  placeholder="Inserisci località o città..."
                  className="flex-1 p-3 border-none outline-none text-gray-700"
                  value={simpleSearch.location}
                  onChange={(e) => handleLocationInput(e.target.value, true)}
                />
              </div>
              <div className="w-full sm:w-48">
                <SearchableMultiSelect
                  options={propertyTypes}
                  selectedValues={simpleSearch.propertyType}
                  onSelectionChange={(values) => setSimpleSearch({...simpleSearch, propertyType: values})}
                  placeholder="Tutte le tipologie"
                  allowSelectAll={false}
                  showSearch={true}
                  className="bg-transparent border-none"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-accent text-white px-8 py-3 rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{isSearching ? 'Ricerca...' : 'Cerca'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Filtri Veloci</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Filtri Veloci:</h3>
            <p className="text-gray-600">Seleziona le caratteristiche che ti interessano di più</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => toggleQuickFilter('vistaLago')}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                quickFilters.vistaLago 
                  ? 'bg-accent text-white border-accent' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
              }`}
            >
              Vista Lago
            </button>
            <button 
              onClick={() => toggleQuickFilter('piscina')}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                quickFilters.piscina 
                  ? 'bg-accent text-white border-accent' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
              }`}
            >
              Piscina
            </button>
            <button 
              onClick={() => toggleQuickFilter('nuovaCostruzione')}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                quickFilters.nuovaCostruzione 
                  ? 'bg-accent text-white border-accent' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
              }`}
            >
              Nuova Costruzione
            </button>
            <button 
              onClick={() => toggleQuickFilter('centroStorico')}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                quickFilters.centroStorico 
                  ? 'bg-accent text-white border-accent' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
              }`}
            >
              Centro Storico
            </button>
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={handleQuickFiltersApply}
              disabled={isSearching}
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
            >
              {isSearching ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Ricerca...</span>
                </>
              ) : (
                <span>Applica Filtri</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Map-Integrated Search */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Ricerca Integrata con Mappa</h3>
        </div>
        <div className="relative h-96">
          {/* Real Map Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/italy-map.jpg)' }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Map Property Markers */}
          <div className="absolute inset-0">
            {/* Milano Marker */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer" title="Milano - 15 proprietà"></div>
            </div>
            {/* Roma Marker */}
            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer" title="Roma - 8 proprietà"></div>
            </div>
            {/* Firenze Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer" title="Firenze - 6 proprietà"></div>
            </div>
            {/* Venezia Marker */}
            <div className="absolute top-1/4 right-1/3 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer" title="Venezia - 3 proprietà"></div>
            </div>
          </div>
          
          {/* Search Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 flex items-center">
                  <Search className="w-5 h-5 text-gray-400 ml-2 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Cerca nell'area visibile..."
                    className="flex-1 p-2 border-none outline-none text-gray-700"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors flex items-center space-x-1">
                    <Filter className="w-4 h-4" />
                    <span>Filtri</span>
                  </button>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-1">
                    <Sliders className="w-4 h-4" />
                    <span>Vista</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                  <span>Disponibile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span>In Trattativa</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  <span>Venduto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h3 className="text-lg font-semibold text-primary">Risultati di Ricerca</h3>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {searchResults.totalCount} Proprietà Trovate
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ricerca completata in {searchResults.searchTime}ms
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Object.entries(searchResults.appliedFilters).filter(([_, value]) => value).length > 0 && (
                  <span>Filtri applicati: {Object.entries(searchResults.appliedFilters).filter(([_, value]) => value).length}</span>
                )}
              </div>
            </div>
            
            {searchResults.totalCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.properties.slice(0, 6).map((property) => (
                  <div key={property.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-accent text-white px-2 py-1 text-xs rounded font-semibold">
                          {property.priceHidden ? 'Su richiesta' : `€${property.price.toLocaleString()}`}
                        </span>
                      </div>
                      {property.badges.length > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary text-white px-2 py-1 text-xs rounded font-semibold">
                            {property.badges[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-primary text-sm mb-2 line-clamp-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.city}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Bed className="w-3 h-3 mr-1" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <Bath className="w-3 h-3 mr-1" />
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <Home className="w-3 h-3 mr-1" />
                            {property.area} mq
                          </span>
                        </div>
                        <span className="text-accent font-semibold">{property.propertyType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna proprietà trovata</h3>
                <p className="text-gray-600 mb-4">Prova a modificare i criteri di ricerca per ottenere più risultati.</p>
                <button 
                  onClick={() => setSearchResults(null)}
                  className="text-accent hover:text-accent/80 font-semibold"
                >
                  Nuova Ricerca
                </button>
              </div>
            )}
            
            {searchResults.totalCount > 6 && (
              <div className="text-center mt-8">
                <button className="bg-accent text-white px-6 py-3 rounded-md hover:bg-accent/90 transition-colors">
                  Mostra tutte le {searchResults.totalCount} proprietà
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { SearchInterfaces };