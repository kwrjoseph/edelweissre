import React from 'react';
import { Grid, List, ChevronDown } from 'lucide-react';

interface ResultsHeaderProps {
  resultsCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const sortOptions = [
  { value: 'default', label: 'Ordine predefinito' },
  { value: 'price_asc', label: 'Prezzo crescente' },
  { value: 'price_desc', label: 'Prezzo decrescente' },
  { value: 'area_asc', label: 'Superficie crescente' },
  { value: 'area_desc', label: 'Superficie decrescente' },
  { value: 'newest', label: 'Più recenti' },
  { value: 'bedrooms_asc', label: 'Camere crescente' },
  { value: 'bedrooms_desc', label: 'Camere decrescente' }
];

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  resultsCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b border-border px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Results Counter */}
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-primary">
            {resultsCount} {resultsCount === 1 ? 'Risultato' : 'Risultati'}
          </h2>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary font-medium">Ordina per:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent text-white'
                  : 'bg-white text-secondary hover:bg-gray-50'
              }`}
              aria-label="Vista griglia"
              title="Vista griglia"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 transition-colors border-l border-border ${
                viewMode === 'list'
                  ? 'bg-accent text-white'
                  : 'bg-white text-secondary hover:bg-gray-50'
              }`}
              aria-label="Vista lista"
              title="Vista lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;