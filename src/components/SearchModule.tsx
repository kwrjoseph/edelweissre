import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, Bed, Bath, Square, TrendingUp, Share2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateShareableUrl } from '../utils/urlParamHelpers';

interface SearchModuleProps {
  variant?: 'hero' | 'compact' | 'inline';
  onSearch?: (searchData: SearchFormData) => void;
  showAdvancedOptions?: boolean;
  className?: string;
}

interface SearchFormData {
  keyword: string;
  city: string;
  propertyType: string;
  contractType: string;
  priceMin: string;
  priceMax: string;
  bedrooms: string;
  bathrooms: string;
}

const SearchModule: React.FC<SearchModuleProps> = ({ 
  variant = 'hero', 
  onSearch, 
  showAdvancedOptions = true,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchData, setSearchData] = useState<SearchFormData>({
    keyword: '',
    city: '',
    propertyType: '',
    contractType: 'vendita',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [showShare, setShowShare] = useState(false);

  // Load data from URL parameters on mount
  useEffect(() => {
    const urlParams = Object.fromEntries(searchParams.entries());
    setSearchData(prev => ({
      ...prev,
      keyword: urlParams.search || '',
      city: urlParams.city?.split(',')[0] || '',
      propertyType: urlParams.type?.split(',')[0] || '',
      contractType: urlParams.contract?.split(',')[0] || 'vendita',
      priceMin: urlParams.priceMin || '',
      priceMax: urlParams.priceMax || '',
      bedrooms: urlParams.bedrooms?.split(',')[0] || '',
      bathrooms: urlParams.bathrooms?.split(',')[0] || ''
    }));
  }, [searchParams]);

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build URL parameters from form data
    const params = new URLSearchParams();
    
    if (searchData.keyword) params.set('search', searchData.keyword);
    if (searchData.city) params.set('city', searchData.city);
    if (searchData.propertyType) params.set('type', searchData.propertyType);
    if (searchData.contractType && searchData.contractType !== 'entrambi') {
      params.set('contract', searchData.contractType);
    }
    if (searchData.priceMin) params.set('priceMin', searchData.priceMin);
    if (searchData.priceMax) params.set('priceMax', searchData.priceMax);
    if (searchData.bedrooms) params.set('bedrooms', searchData.bedrooms);
    if (searchData.bathrooms) params.set('bathrooms', searchData.bathrooms);

    // Navigate to main platform with search parameters
    navigate(`/?${params.toString()}`);
    
    // Call external search handler if provided
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleShare = async () => {
    const shareableUrl = generateShareableUrl(
      window.location.origin + '/',
      {
        keyword: searchData.keyword,
        city: searchData.city ? [searchData.city] : [],
        propertyType: searchData.propertyType ? [searchData.propertyType] : [],
        contractType: searchData.contractType ? [searchData.contractType] : []
      },
      {
        priceMin: searchData.priceMin,
        priceMax: searchData.priceMax
      }
    );
    
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  const cities = [
    'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze', 'Catania', 'Bari'
  ];

  const propertyTypes = [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'villa', label: 'Villa' },
    { value: 'casa-indipendente', label: 'Casa Indipendente' },
    { value: 'attico', label: 'Attico' },
    { value: 'loft', label: 'Loft' },
    { value: 'commerciale', label: 'Commerciale' }
  ];

  const contractTypes = [
    { value: 'vendita', label: 'Vendita' },
    { value: 'affitto', label: 'Affitto' },
    { value: 'entrambi', label: 'Entrambi' }
  ];

  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const bathroomOptions = ['1', '2', '3', '4+'];

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchData.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              placeholder="Cerca per città, indirizzo o ID proprietà"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select
              value={searchData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] text-sm"
            >
              <option value="">Tutte le città</option>
              {cities.map(city => (
                <option key={city} value={city.toLowerCase()}>{city}</option>
              ))}
            </select>
            
            <select
              value={searchData.contractType}
              onChange={(e) => handleInputChange('contractType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] text-sm"
            >
              {contractTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={searchData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] text-sm"
            >
              <option value="">Tutti i tipi</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <button
              type="submit"
              className="bg-[#C5A46D] text-white px-4 py-2 rounded-lg hover:bg-[#B8976A] transition-colors text-sm font-medium"
            >
              Cerca
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-xl p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchData.keyword}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
            placeholder="Inserisci qui un indirizzo, una città o un ID proprietà"
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="inline w-4 h-4 mr-1" />
              Città
            </label>
            <select
              value={searchData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
            >
              <option value="">Tutte le città</option>
              {cities.map(city => (
                <option key={city} value={city.toLowerCase()}>{city}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Home className="inline w-4 h-4 mr-1" />
              Tipo Proprietà
            </label>
            <select
              value={searchData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
            >
              <option value="">Tutti i tipi</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Contract Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              Contratto
            </label>
            <select
              value={searchData.contractType}
              onChange={(e) => handleInputChange('contractType', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
            >
              {contractTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Bed className="inline w-4 h-4 mr-1" />
              Camere
            </label>
            <select
              value={searchData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
            >
              <option value="">Qualsiasi</option>
              {bedroomOptions.map(option => (
                <option key={option} value={option}>{option} {option === '5+' ? '' : option === '1' ? 'camera' : 'camere'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvancedOptions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Prezzo (€)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={searchData.priceMin}
                  onChange={(e) => handleInputChange('priceMin', e.target.value)}
                  placeholder="Min"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
                />
                <input
                  type="number"
                  value={searchData.priceMax}
                  onChange={(e) => handleInputChange('priceMax', e.target.value)}
                  placeholder="Max"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
                />
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Bath className="inline w-4 h-4 mr-1" />
                Bagni
              </label>
              <select
                value={searchData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent"
              >
                <option value="">Qualsiasi</option>
                {bathroomOptions.map(option => (
                  <option key={option} value={option}>{option} {option === '4+' ? '' : option === '1' ? 'bagno' : 'bagni'}</option>
                ))}
              </select>
            </div>

            {/* Search Actions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Azioni</label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A46D] text-white px-6 py-3 rounded-lg hover:bg-[#B8976A] transition-colors font-medium"
                >
                  Cerca Proprietà
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors relative"
                  title="Condividi ricerca"
                >
                  <Share2 className="w-5 h-5" />
                  {showShare && (
                    <div className="absolute -top-10 right-0 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      URL copiato!
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchModule;