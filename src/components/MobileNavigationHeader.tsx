import React from 'react';
import { Search, Filter, Map, List, ChevronDown } from 'lucide-react';

interface MobileNavigationHeaderProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: () => void;
  activeFiltersCount: number;
  onFiltersOpen: () => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showMobileMap: boolean;
  onToggleMobileMap: () => void;
  resultsCount: number;
}

const sortOptions = [
  { value: 'default', label: 'Consigliato' },
  { value: 'price_asc', label: 'Prezzo: Basso ad Alto' },
  { value: 'price_desc', label: 'Prezzo: Alto a Basso' },
  { value: 'newest', label: 'Più Recenti' },
  { value: 'area_desc', label: 'Superficie: Grande a Piccola' },
  { value: 'area_asc', label: 'Superficie: Piccola a Grande' }
];

const MobileNavigationHeader: React.FC<MobileNavigationHeaderProps> = ({
  keyword,
  onKeywordChange,
  onSearch,
  activeFiltersCount,
  onFiltersOpen,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showMobileMap,
  onToggleMobileMap,
  resultsCount
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Consigliato';

  return (
    <div className="md:hidden bg-white border-b border-gray-200">
      {/* Search Bar */}
      <div className="px-4 py-3">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Cerca per città, quartiere o ID proprietà"
            className="w-full h-12 pl-4 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#e3ae61] focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-[#e3ae61] transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Navigation Controls */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 overflow-x-hidden">
        {/* Left side - Results and Filters */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          {/* Results count */}
          <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            {resultsCount.toLocaleString()}
          </div>
          
          {/* Filters button */}
          <button
            onClick={onFiltersOpen}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              activeFiltersCount > 0 
                ? 'bg-[#e3ae61] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Filtri</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#e3ae61] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side - Sort and View controls */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Sort dropdown - More compact */}
          <div className="relative min-w-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-gray-100 border-0 text-gray-700 text-xs font-medium pl-2.5 pr-6 py-1.5 rounded-lg focus:outline-none focus:bg-gray-200 cursor-pointer min-w-0 max-w-[120px] truncate"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Map/List toggle */}
          <button
            onClick={onToggleMobileMap}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              showMobileMap 
                ? 'bg-[#e3ae61] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={showMobileMap ? 'Mostra lista' : 'Mostra mappa'}
          >
            {showMobileMap ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationHeader;