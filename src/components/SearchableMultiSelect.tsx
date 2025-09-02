import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  label?: string;
  maxHeight?: string;
  disabled?: boolean;
  showSearch?: boolean;
  allowSelectAll?: boolean;
  className?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  label,
  maxHeight = 'max-h-60',
  disabled = false,
  showSearch = true,
  allowSelectAll = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate dropdown position to prevent overflow
  const calculateDropdownPosition = () => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 384; // w-96 = 384px
    
    // Check if dropdown would overflow on the right
    const wouldOverflow = triggerRect.left + dropdownWidth > viewportWidth - 20; // 20px margin
    
    setDropdownPosition(wouldOverflow ? 'right' : 'left');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Recalculate position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen]);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (searchTerm) {
      // Select all filtered options
      const filteredValues = filteredOptions.map(opt => opt.value);
      const newSelection = [...new Set([...selectedValues, ...filteredValues])];
      onSelectionChange(newSelection);
    } else {
      // Select all options
      onSelectionChange(options.map(opt => opt.value));
    }
  };

  const handleDeselectAll = () => {
    if (searchTerm) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map(opt => opt.value);
      const newSelection = selectedValues.filter(v => !filteredValues.includes(v));
      onSelectionChange(newSelection);
    } else {
      // Deselect all options
      onSelectionChange([]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option ? option.label : placeholder;
    }
    if (selectedValues.length === options.length) {
      return 'Tutti selezionati';
    }
    return `${selectedValues.length} selezionati`;
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-1">
          {label}
        </label>
      )}
      
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 text-left bg-white border border-gray-300 rounded-md
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors
          ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
          ${isOpen ? 'border-accent ring-1 ring-accent' : ''}
          ${className.includes('h-12') ? 'h-12 flex items-center' : 'py-2'}
          text-gray-900 text-sm
        `}
      >
        <div className="flex items-center justify-between w-full">
          <span className={`truncate ${selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
            {getDisplayText()}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={`
          absolute z-[100] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
          ${dropdownPosition === 'right' ? 'right-0' : 'left-0'}
          w-80 md:w-96 min-w-full
        `}>
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cerca..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
          )}

          {/* Bulk Controls */}
          {allowSelectAll && filteredOptions.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex-1 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-button-hover transition-colors"
                >
                  Seleziona tutto
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Deseleziona tutto
                </button>
              </div>
            </div>
          )}

          {/* Options List */}
          <div className={`${maxHeight} overflow-y-auto`}>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                {searchTerm ? 'Nessun risultato trovato' : 'Nessuna opzione disponibile'}
              </div>
            ) : (
              <div className="py-2">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggleOption(option.value)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <div className={`
                        w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                        ${isSelected ? 'bg-primary border-primary' : 'bg-white'}
                      `}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700 truncate">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableMultiSelect;
