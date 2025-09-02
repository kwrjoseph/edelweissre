import React, { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Plus, Minus, Globe, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Extend Window interface to include hoverTimeout
declare global {
  interface Window {
    hoverTimeout?: NodeJS.Timeout;
  }
}

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

interface MapComponentProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  selectedProperty: Property | null;
  hoveredProperty: Property | null;
  onNextProperty: () => void;
  onPreviousProperty: () => void;
  currentPropertyIndex: number;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 45.4642, // Milan coordinates
  lng: 9.1900
};

const mapOptions = {
  disableDefaultUI: true, // Disable all default controls
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk';

const MapComponent: React.FC<MapComponentProps> = ({
  properties,
  onPropertySelect,
  selectedProperty,
  hoveredProperty,
  onNextProperty,
  onPreviousProperty,
  currentPropertyIndex,
  className = ''
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [currentMapType, setCurrentMapType] = useState('roadmap');
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Create info window
    const infoWindowInstance = new google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
  }, []);

  // Map control functions
  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 10;
      map.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 10;
      map.setZoom(Math.max(currentZoom - 1, 1));
    }
  };

  const handleMapTypeChange = (mapType: string) => {
    if (map) {
      map.setMapTypeId(mapType as google.maps.MapTypeId);
      setCurrentMapType(mapType);
      setShowViewDropdown(false);
    }
  };

  const mapTypeOptions = [
    { value: 'roadmap', label: 'TABELLA DI MARCIA' },
    { value: 'satellite', label: 'SATELLITARE' },
    { value: 'hybrid', label: 'IBRIDA' },
    { value: 'terrain', label: 'TERRENO' }
  ];

  // Navigation handlers
  const handleNextProperty = () => {
    console.log('Next button clicked, properties length:', properties.length, 'current index:', currentPropertyIndex);
    if (properties.length === 0) {
      console.log('No properties available, returning early');
      return;
    }
    console.log('Calling onNextProperty');
    onNextProperty();
  };

  const handlePreviousProperty = () => {
    console.log('Previous button clicked, properties length:', properties.length, 'current index:', currentPropertyIndex);
    if (properties.length === 0) {
      console.log('No properties available, returning early');
      return;
    }
    console.log('Calling onPreviousProperty');
    onPreviousProperty();
  };

  // Auto-center map on selected property and open info window
  useEffect(() => {
    if (!map || !selectedProperty || !infoWindow) {
      console.log('Missing dependencies for info window:', { map: !!map, selectedProperty: !!selectedProperty, infoWindow: !!infoWindow });
      return;
    }

    console.log('Centering map on selected property:', selectedProperty.title);
    // Close any existing info window first
    infoWindow.close();
    
    // Center map on selected property
    map.panTo(selectedProperty.coordinates);
    
    // Small delay to ensure map has panned before opening info window
    setTimeout(() => {
      // Find the corresponding marker and open info window
      const markerIndex = properties.findIndex(p => p.id === selectedProperty.id);
      if (markerIndex !== -1 && markersRef.current[markerIndex]) {
        const marker = markersRef.current[markerIndex];
        
        const content = `
          <div class="p-4 max-w-xs">
            <img src="${selectedProperty.images[0]}" alt="${selectedProperty.title}" class="w-full h-28 object-cover rounded-lg mb-3" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg=='" />
            <h4 class="font-semibold text-base mb-2 text-gray-900">${selectedProperty.title}</h4>
            <p class="text-gray-600 text-sm mb-3 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2C7.79 2 6 3.79 6 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S9.17 4.5 10 4.5s1.5.67 1.5 1.5S10.83 7.5 10 7.5z"/>
              </svg>
              ${selectedProperty.address}
            </p>
            <div class="flex items-center justify-between mb-3 text-sm">
              <div class="flex gap-3 text-gray-600">
                <span class="flex items-center">🛏️ ${selectedProperty.bedrooms}</span>
                <span class="flex items-center">🚿 ${selectedProperty.bathrooms}</span>
                <span class="flex items-center">📐 ${selectedProperty.area} mq</span>
              </div>
            </div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm text-gray-500">
                <span>${selectedProperty.propertyType} • ${selectedProperty.contractType}</span>
              </div>
              ${selectedProperty.featured ? '<span class="text-xs bg-[#e3ae61] text-white px-2 py-1 rounded-full">In Evidenza</span>' : ''}
            </div>
            <div class="flex items-center justify-between">
              <div class="text-lg font-bold text-[#C5A46D]">
                ${selectedProperty.priceHidden ? 'Prezzo su richiesta' : `€${selectedProperty.price.toLocaleString()}`}
              </div>
              <button class="bg-[#C5A46D] text-white py-2 px-3 rounded-lg text-sm hover:bg-opacity-90 transition-colors">
                Dettagli
              </button>
            </div>
            <div class="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500 text-center">
              Proprietà ${currentPropertyIndex + 1} di ${properties.length}
            </div>
          </div>
        `;
        
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        console.log('Info window opened for property:', selectedProperty.title);
      } else {
        console.log('Marker not found for selected property');
      }
    }, 300);
  }, [selectedProperty, map, infoWindow, properties, currentPropertyIndex]);

  // Create custom marker icon
  const createMarkerIcon = (property: Property, isHovered: boolean = false) => {
    const scale = isHovered ? 1.1 : 1;
    
    // Brown teardrop marker for specific properties
    const tearDropPath = 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2z';
    
    return {
      path: tearDropPath,
      fillColor: '#c5a483',
      fillOpacity: 1,
      strokeColor: '#a8896c',
      strokeWeight: 2,
      scale: 1.2 * scale,
      anchor: new google.maps.Point(12, 24), // Anchor at bottom point of teardrop
    };
  };

  // Create city cluster marker
  const createCityMarker = (count: number, position: google.maps.LatLng) => {
    const size = Math.min(50, 30 + Math.sqrt(count) * 3);
    
    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(`
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="#333333" stroke="white" stroke-width="2"/>
            <text x="${size/2}" y="${size/2}" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial" font-size="${Math.min(14, size/3)}" font-weight="bold">${count}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size/2, size/2)
      },
      zIndex: 1000
    });
  };

  // Update markers when properties change
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers and clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const markers = properties.map(property => {
      const marker = new google.maps.Marker({
        position: property.coordinates,
        icon: createMarkerIcon(property),
        title: property.title,
        zIndex: property.featured ? 2 : 1
      });

      // Add click listener
      marker.addListener('click', () => {
        onPropertySelect(property);
        
        if (infoWindow) {
          const content = `
            <div class="p-3 max-w-xs">
              <img src="${property.images[0]}" alt="${property.title}" class="w-full h-24 object-cover rounded mb-2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg=='" />
              <h4 class="font-semibold text-sm mb-1">${property.title}</h4>
              <p class="text-gray-600 text-xs mb-2">${property.address}</p>
              <div class="flex gap-2 text-xs text-gray-500">
                <span>${property.bedrooms} camere</span>
                <span>${property.bathrooms} bagni</span>
                <span>${property.area} mq</span>
              </div>
              <button class="mt-2 w-full bg-[#C5A46D] text-white py-1 px-3 rounded text-xs hover:bg-opacity-90">
                Dettagli
              </button>
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        }
      });

      return marker;
    });

    markersRef.current = markers;

    // Create clusterer with custom city markers
    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        markers,
        map,
        renderer: {
          render: ({ count, position }) => {
            return createCityMarker(count, position);
          }
        }
      });
    }
  }, [map, properties, isLoaded, onPropertySelect, infoWindow]);

  // Update marker appearance when property is hovered
  useEffect(() => {
    if (!hoveredProperty || !markersRef.current.length) return;

    markersRef.current.forEach((marker, index) => {
      const property = properties[index];
      const isHovered = property.id === hoveredProperty.id;
      marker.setIcon(createMarkerIcon(property, isHovered));
      if (isHovered) {
        marker.setZIndex(1000);
      } else {
        marker.setZIndex(property.featured ? 2 : 1);
      }
    });
  }, [hoveredProperty, properties]);

  // Handle hovered property - center map and show popup with smooth transitions
  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear any existing hover timeout
    if (window.hoverTimeout) {
      clearTimeout(window.hoverTimeout);
    }

    if (hoveredProperty) {
      // Debounce hover to prevent flickering - 200ms delay
      window.hoverTimeout = setTimeout(() => {
        console.log('Centering map on hovered property:', hoveredProperty.title);
        
        // Smooth pan to hovered property with animation
        map.panTo(hoveredProperty.coordinates);
        
        // Find the corresponding marker
        const markerIndex = properties.findIndex(p => p.id === hoveredProperty.id);
        if (markerIndex !== -1 && markersRef.current[markerIndex]) {
          const marker = markersRef.current[markerIndex];
          
          // Create enhanced popup content for hovered property
          const content = `
            <div class="p-4 max-w-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">HOVER PREVIEW</span>
                ${hoveredProperty.featured ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">FEATURED</span>' : ''}
              </div>
              <img src="${hoveredProperty.images[0]}" alt="${hoveredProperty.title}" class="w-full h-28 object-cover rounded-lg mb-3" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ci8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg==' />" 
              <h4 class="font-semibold text-base mb-1">${hoveredProperty.title}</h4>
              <p class="text-gray-600 text-sm mb-2">${hoveredProperty.address}</p>
              <div class="flex justify-between items-center mb-3">
                <div class="text-lg font-bold text-[#C5A46D]">
                  ${hoveredProperty.priceHidden ? 'Prezzo su richiesta' : new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(hoveredProperty.price)}
                </div>
                <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">${hoveredProperty.propertyType}</div>
              </div>
              <div class="grid grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 22 6-6"></path>
                  </svg>
                  <span>${hoveredProperty.bedrooms}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  </svg>
                  <span>${hoveredProperty.bathrooms}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                  <span>${hoveredProperty.area}m²</span>
                </div>
              </div>
              <div class="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded text-center">
                💡 Fai clic sulla card per maggiori dettagli
              </div>
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          console.log('Hover popup opened for property:', hoveredProperty.title);
        }
      }, 200); // 200ms debounce delay to prevent flickering
    } else {
      // Property hover ended - close popup after a short delay if no property is selected
      window.hoverTimeout = setTimeout(() => {
        if (!selectedProperty) { // Don't close if there's a selected property
          infoWindow.close();
          console.log('Hover popup closed');
        }
      }, 100); // 100ms delay before closing to smooth the experience
    }

    // Cleanup function
    return () => {
      if (window.hoverTimeout) {
        clearTimeout(window.hoverTimeout);
      }
    };
  }, [hoveredProperty, map, infoWindow, properties, selectedProperty]);

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <p className="text-red-500 mb-2">Errore nel caricamento della mappa</p>
          <p className="text-sm text-gray-600">Riprova più tardi</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container relative ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      />
      
      {/* Zoom Controls - Top Left */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-primary-button border border-primary-button-border text-white rounded-lg hover:bg-primary-button-hover transition-colors shadow-lg flex items-center justify-center"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-primary-button border border-primary-button-border text-white rounded-lg hover:bg-primary-button-hover transition-colors shadow-lg flex items-center justify-center"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Controls - Top Right */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        {/* View Control with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowViewDropdown(!showViewDropdown)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-primary-button border border-primary-button-border text-white rounded-lg hover:bg-primary-button-hover transition-colors shadow-lg"
          >
            <Globe className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">VIEW</span>
            <ChevronDown className="w-2 h-2 md:w-3 md:h-3" />
          </button>
          
          {/* Dropdown Menu */}
          {showViewDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] z-30">
              {mapTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMapTypeChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentMapType === option.value ? 'bg-gray-100 font-medium' : ''
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Previous/Next Navigation */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Previous button clicked - direct handler');
            handlePreviousProperty();
          }}
          disabled={properties.length === 0}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-primary-button border border-primary-button-border text-white rounded-lg hover:bg-primary-button-hover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative z-30"
          aria-label="Previous property"
          type="button"
        >
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-xs md:text-sm font-medium hidden sm:inline">PRECEDENTE</span>
        </button>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Next button clicked - direct handler');
            handleNextProperty();
          }}
          disabled={properties.length === 0}
          className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-primary-button border border-primary-button-border text-white rounded-lg hover:bg-primary-button-hover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative z-30"
          aria-label="Next property"
          type="button"
        >
          <span className="text-xs md:text-sm font-medium hidden sm:inline">SUCCESSIVO</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        
        {/* Property Counter */}
        {properties.length > 0 && (
          <div className="flex items-center px-2 md:px-3 py-1.5 md:py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-lg relative z-30">
            <span className="text-xs md:text-sm font-medium">
              {currentPropertyIndex + 1} / {properties.length}
            </span>
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdown */}
      {showViewDropdown && (
        <div 
          className="fixed inset-0 z-15" 
          onClick={() => setShowViewDropdown(false)}
        />
      )}
    </div>
  );
};

export default MapComponent;