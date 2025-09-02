import React, { useState, useCallback, useEffect } from 'react';
import SearchFilters from './SearchFilters';
import PropertyGrid from './PropertyGrid';
import ResultsHeader from './ResultsHeader';
import MapComponent from './MapComponent';
import LeadCaptureModal from './LeadCaptureModal';
import PropertyDetailModal from './PropertyDetailModal';
import AdvancedFiltersPanel, { AdvancedFilterState } from './AdvancedFiltersPanel';
import MobileNavigationHeader from './MobileNavigationHeader';
import MobileFilterSheet from './MobileFilterSheet';
import useProperties from '../hooks/useProperties';

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  region: string;
  propertyType: string;
  contractType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  badges: string[];
  featured: boolean;
  isNew: boolean;
  price: number;
  priceHidden: boolean;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  propertyId: string;
  propertyTitle: string;
}

export function MainPlatform() {
  const {
    filteredProperties,
    filters,
    favorites,
    sortBy,
    updateFilter,
    updateAdvancedFilters,
    clearAdvancedFilters,
    toggleFavorite,
    setSortBy,
    search,
    isLoading
  } = useProperties();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadProperty, setLeadProperty] = useState<Property | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState<number>(0);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Handle URL hash changes for property modal
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const propertyMatch = hash.match(/^#\/property\/(\w+)$/);
      
      if (propertyMatch) {
        setSelectedPropertyId(propertyMatch[1]);
      } else {
        setSelectedPropertyId(null);
      }
    };

    // Handle initial hash on load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
    // Update current index when property is selected
    const index = filteredProperties.findIndex(p => p.id === property.id);
    if (index !== -1) {
      setCurrentPropertyIndex(index);
    }
  }, [filteredProperties]);

  const handlePropertyHover = useCallback((property: Property | null) => {
    setHoveredProperty(property);
  }, []);

  const handlePriceRequest = useCallback((property: Property) => {
    console.log('Price request handler called for property:', property.id);
    setLeadProperty(property);
    setIsLeadModalOpen(true);
  }, []);

  const handlePropertyDetailsClick = useCallback((propertyId: string) => {
    console.log('Property details handler called for property:', propertyId);
    // Update URL hash to open modal
    window.location.hash = `#/property/${propertyId}`;
  }, []);

  const handleClosePropertyModal = useCallback(() => {
    // Clear hash to close modal
    window.location.hash = '#/';
  }, []);

  const handleLeadSubmit = async (leadData: LeadFormData) => {
    try {
      // Here you would normally send the data to your backend/CRM
      console.log('Lead form submitted:', leadData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Grazie! La tua richiesta è stata inviata con successo. Ti contatteremo presto.');
      
      // Close modal
      setIsLeadModalOpen(false);
      setLeadProperty(null);
    } catch (error) {
      console.error('Error submitting lead form:', error);
      alert('Si è verificato un errore. Riprova più tardi.');
    }
  };

  const toggleMobileMap = () => {
    setShowMobileMap(!showMobileMap);
  };

  const handleMobileFiltersOpen = () => {
    setIsMobileFiltersOpen(true);
  };

  const handleMobileFiltersClose = () => {
    setIsMobileFiltersOpen(false);
  };

  // Get active filters count for mobile navigation
  const getActiveFiltersCount = () => {
    const counts = {
      location: filters.location.length,
      city: filters.city.length,
      propertyType: filters.propertyType.length,
      contractType: filters.contractType.length,
      bedrooms: filters.bedrooms.length,
      bathrooms: filters.bathrooms.length,
      area: filters.areaMin.length + filters.areaMax.length
    };
    return Object.values(counts).reduce((sum, count) => sum + count, 0) + (filters.keyword ? 1 : 0);
  };

  const handleMobileFiltersApply = () => {
    // Search is triggered automatically by filter changes
    setIsMobileFiltersOpen(false);
  };

  const handleMobileFiltersClear = () => {
    clearAdvancedFilters();
    updateFilter('keyword', '');
  };

  const handleAdvancedFiltersOpen = () => {
    setIsAdvancedFiltersOpen(true);
  };

  const handleAdvancedFiltersClose = () => {
    setIsAdvancedFiltersOpen(false);
  };

  const handleAdvancedFiltersApply = (filters: AdvancedFilterState) => {
    // Ensure no navigation occurs during filter application
    console.log('MainPlatform - Handling advanced filters apply:', filters);
    
    try {
      // Apply the filters to the properties
      updateAdvancedFilters(filters);
      
      // Close the filters panel
      setIsAdvancedFiltersOpen(false);
      
      console.log('MainPlatform - Advanced filters applied successfully:', filters);
      
      // Prevent any potential navigation by explicitly staying on current page
      if (typeof window !== 'undefined') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (error) {
      console.error('MainPlatform - Error applying advanced filters:', error);
    }
  };

  const handleAdvancedFiltersClear = () => {
    clearAdvancedFilters();
    console.log('Advanced filters cleared');
  };



  // Navigation functions for map property browsing
  const handleNextProperty = useCallback(() => {
    console.log('MainPlatform handleNextProperty called, filteredProperties.length:', filteredProperties.length, 'currentPropertyIndex:', currentPropertyIndex);
    if (filteredProperties.length === 0) {
      console.log('No filtered properties, returning early');
      return;
    }
    
    const nextIndex = (currentPropertyIndex + 1) % filteredProperties.length;
    console.log('Setting next index to:', nextIndex, 'property:', filteredProperties[nextIndex]?.title);
    setCurrentPropertyIndex(nextIndex);
    setSelectedProperty(filteredProperties[nextIndex]);
  }, [currentPropertyIndex, filteredProperties]);

  const handlePreviousProperty = useCallback(() => {
    console.log('MainPlatform handlePreviousProperty called, filteredProperties.length:', filteredProperties.length, 'currentPropertyIndex:', currentPropertyIndex);
    if (filteredProperties.length === 0) {
      console.log('No filtered properties, returning early');
      return;
    }
    
    const prevIndex = currentPropertyIndex === 0 
      ? filteredProperties.length - 1 
      : currentPropertyIndex - 1;
    console.log('Setting previous index to:', prevIndex, 'property:', filteredProperties[prevIndex]?.title);
    setCurrentPropertyIndex(prevIndex);
    setSelectedProperty(filteredProperties[prevIndex]);
  }, [currentPropertyIndex, filteredProperties]);

  // Reset current index when filtered properties change
  useEffect(() => {
    console.log('Filtered properties changed, length:', filteredProperties.length);
    if (filteredProperties.length > 0) {
      // If current property is still in filtered results, keep its index
      if (selectedProperty) {
        const newIndex = filteredProperties.findIndex(p => p.id === selectedProperty.id);
        if (newIndex !== -1) {
          console.log('Current property still in filtered results, index:', newIndex);
          setCurrentPropertyIndex(newIndex);
        } else {
          // Property not in filtered results, reset to first
          console.log('Current property not in filtered results, resetting to first');
          setCurrentPropertyIndex(0);
          setSelectedProperty(filteredProperties[0]);
        }
      } else {
        // No property selected, start with first
        console.log('No property selected, setting first property:', filteredProperties[0]?.title);
        setCurrentPropertyIndex(0);
        setSelectedProperty(filteredProperties[0]);
      }
    } else {
      // No properties, reset
      console.log('No filtered properties, resetting');
      setCurrentPropertyIndex(0);
      setSelectedProperty(null);
    }
  }, [filteredProperties.length]); // Remove selectedProperty from dependency to prevent infinite loops

  return (
    <main className="flex-1">
      {/* Mobile Navigation Header */}
      <MobileNavigationHeader
        keyword={filters.keyword}
        onKeywordChange={(keyword) => updateFilter('keyword', keyword)}
        onSearch={search}
        activeFiltersCount={getActiveFiltersCount()}
        onFiltersOpen={handleMobileFiltersOpen}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showMobileMap={showMobileMap}
        onToggleMobileMap={toggleMobileMap}
        resultsCount={filteredProperties.length}
      />

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Map Section - Left Side */}
        <div className="w-3/5 relative">
          <MapComponent
            properties={filteredProperties}
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
            hoveredProperty={hoveredProperty}
            onNextProperty={handleNextProperty}
            onPreviousProperty={handlePreviousProperty}
            currentPropertyIndex={currentPropertyIndex}
            className="h-full"
          />
        </div>

        {/* Content Section - Right Side */}
        <div className="w-2/5 flex flex-col overflow-hidden">
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Filters - Now slides with content */}
            <SearchFilters
              filters={filters}
              onFilterChange={updateFilter}
              onSearch={search}
              onAdvancedFiltersOpen={handleAdvancedFiltersOpen}
            />

            {/* Results Header */}
            <ResultsHeader
              resultsCount={filteredProperties.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Property Listings */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                    <p className="text-sm text-secondary">Caricamento proprietà...</p>
                  </div>
                </div>
              ) : (
                <PropertyGrid
                  properties={filteredProperties}
                  onPropertyHover={handlePropertyHover}
                  onFavoriteToggle={toggleFavorite}
                  onPriceRequest={handlePriceRequest}
                  onPropertyDetailsClick={handlePropertyDetailsClick}
                  favorites={favorites}
                  viewMode={viewMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Toggle between Map and Cards */}
      <div className="md:hidden">
        {showMobileMap ? (
          /* Mobile Map View - Full Screen */
          <div className="h-[calc(100vh-120px)] relative">
            <MapComponent
              properties={filteredProperties}
              onPropertySelect={handlePropertySelect}
              selectedProperty={selectedProperty}
              hoveredProperty={hoveredProperty}
              onNextProperty={handleNextProperty}
              onPreviousProperty={handlePreviousProperty}
              currentPropertyIndex={currentPropertyIndex}
              className="h-full"
            />
          </div>
        ) : (
          /* Mobile Card View */
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
                  <p className="text-sm text-secondary">Caricamento proprietà...</p>
                </div>
              </div>
            ) : (
              <PropertyGrid
                properties={filteredProperties}
                onPropertyHover={handlePropertyHover}
                onFavoriteToggle={toggleFavorite}
                onPriceRequest={handlePriceRequest}
                onPropertyDetailsClick={handlePropertyDetailsClick}
                favorites={favorites}
                viewMode="grid" // Always use mobile card layout
              />
            )}
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedPropertyId && (
        <PropertyDetailModal
          propertyId={selectedPropertyId}
          onClose={handleClosePropertyModal}
        />
      )}

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setLeadProperty(null);
        }}
        property={leadProperty}
        onSubmit={handleLeadSubmit}
      />

      {/* Desktop Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={isAdvancedFiltersOpen}
        onClose={handleAdvancedFiltersClose}
        onApply={handleAdvancedFiltersApply}
        onClear={handleAdvancedFiltersClear}
      />

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isMobileFiltersOpen}
        onClose={handleMobileFiltersClose}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleMobileFiltersApply}
        onClear={handleMobileFiltersClear}
        onAdvancedFiltersApply={updateAdvancedFilters}
        onAdvancedFiltersClear={clearAdvancedFilters}
      />
    </main>
  );
}