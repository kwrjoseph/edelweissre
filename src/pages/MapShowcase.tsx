import React, { useState, useEffect } from 'react';
import { MapPin, Home, Building, Warehouse, Heart, Eye, Euro } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  city: string;
  region: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: { lat: number; lng: number; };
  price: number;
  images?: string[];
}

const MapShowcase: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeMap, setActiveMap] = useState<number>(1);

  useEffect(() => {
    // Load properties data
    fetch('/data/properties.json')
      .then(response => response.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error loading properties:', error));
  }, []);

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'villa':
        return <Home className="h-4 w-4" />;
      case 'appartamento':
        return <Building className="h-4 w-4" />;
      case 'magazzino':
      case 'warehouse':
        return <Warehouse className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Mock map component for demonstration
  const MapContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <img 
        src="/images/italy-map.jpg" 
        alt="Map" 
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );

  // Map 1: Classic Pins with Tooltips
  const ClassicPinMap = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Mappa Classica con Pin</h3>
        <div className="text-sm text-gray-600">{properties.length} Proprietà</div>
      </div>
      
      <MapContainer className="h-80">
        {properties.slice(0, 12).map((property, index) => (
          <div
            key={property.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full group"
            style={{
              left: `${15 + (index % 4) * 20}%`,
              top: `${20 + Math.floor(index / 4) * 25}%`,
            }}
            onMouseEnter={() => setSelectedProperty(property)}
            onMouseLeave={() => setSelectedProperty(null)}
          >
            {/* Classic Pin */}
            <div className="relative">
              <div className="w-8 h-8 bg-[#e3ae61] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform">
                {formatPrice(property.price).slice(0, -3)}K
              </div>
              <div className="w-2 h-2 bg-[#e3ae61] transform rotate-45 mx-auto -mt-1"></div>
            </div>
            
            {/* Tooltip */}
            {selectedProperty?.id === property.id && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-64 z-20">
                <div className="text-sm font-semibold text-gray-900 mb-1">{property.title}</div>
                <div className="text-xs text-gray-600 mb-2">{property.city}, {property.region}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">{property.propertyType}</span>
                  <span className="font-bold text-[#e3ae61]">{formatPrice(property.price)}</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );

  // Map 2: Clustered Circles
  const ClusteredCircleMap = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Mappa a Cerchi Raggruppati</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>€500K+</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>€200K-500K</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>€200K-</span>
          </div>
        </div>
      </div>
      
      <MapContainer className="h-80">
        {properties.slice(0, 10).map((property, index) => {
          const priceColor = property.price > 500000 ? 'bg-red-500' : 
                           property.price > 200000 ? 'bg-yellow-500' : 'bg-green-500';
          const size = property.price > 500000 ? 'w-12 h-12' : 
                      property.price > 200000 ? 'w-10 h-10' : 'w-8 h-8';
          
          return (
            <div
              key={property.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${10 + (index % 5) * 18}%`,
                top: `${15 + Math.floor(index / 5) * 35}%`,
              }}
            >
              <div className={`${size} ${priceColor} rounded-full opacity-80 flex items-center justify-center text-white font-bold text-xs hover:opacity-100 transition-all hover:scale-110`}>
                {Math.floor(property.price / 1000)}K
              </div>
              
              {/* Hover info */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {property.title}
              </div>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );

  // Map 3: Icon-based Markers
  const IconMarkerMap = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Mappa con Marcatori per Tipo</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Home className="w-4 h-4 text-blue-600 mr-1" />
            <span>Ville</span>
          </div>
          <div className="flex items-center">
            <Building className="w-4 h-4 text-green-600 mr-1" />
            <span>Appartamenti</span>
          </div>
          <div className="flex items-center">
            <Warehouse className="w-4 h-4 text-purple-600 mr-1" />
            <span>Commerciali</span>
          </div>
        </div>
      </div>
      
      <MapContainer className="h-80">
        {properties.slice(0, 15).map((property, index) => {
          const iconColor = property.propertyType === 'Villa' ? 'text-blue-600 bg-blue-100' :
                           property.propertyType === 'Appartamento' ? 'text-green-600 bg-green-100' :
                           'text-purple-600 bg-purple-100';
          
          return (
            <div
              key={property.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${8 + (index % 6) * 15}%`,
                top: `${12 + Math.floor(index / 6) * 28}%`,
              }}
            >
              <div className={`w-10 h-10 ${iconColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}>
                {getPropertyIcon(property.propertyType)}
              </div>
              
              {/* Property info card */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-2 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="text-sm font-semibold text-gray-900 mb-1">{property.title}</div>
                <div className="text-xs text-gray-600 mb-2">{property.city}</div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <span>{property.bedrooms}🛏️</span>
                    <span>{property.bathrooms}🚿</span>
                    <span>{property.area}m²</span>
                  </div>
                  <span className="font-bold text-[#e3ae61]">{formatPrice(property.price)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );

  // Map 4: Heatmap Style
  const HeatmapStyleMap = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Mappa Densità Prezzi</h3>
        <div className="text-sm text-gray-600">Intensità basata sul valore immobiliare</div>
      </div>
      
      <MapContainer className="h-80">
        {/* Heat zones */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 opacity-30 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-orange-500 opacity-25 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-yellow-500 opacity-20 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-green-500 opacity-15 rounded-full blur-sm"></div>
        
        {properties.slice(0, 12).map((property, index) => {
          const intensity = property.price > 400000 ? 'high' : 
                           property.price > 250000 ? 'medium' : 'low';
          const markerStyle = intensity === 'high' ? 'bg-red-600 ring-red-300' :
                             intensity === 'medium' ? 'bg-orange-500 ring-orange-300' :
                             'bg-green-500 ring-green-300';
          
          return (
            <div
              key={property.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${12 + (index % 4) * 22}%`,
                top: `${18 + Math.floor(index / 4) * 25}%`,
              }}
            >
              <div className={`w-6 h-6 ${markerStyle} rounded-full ring-4 ring-opacity-40 flex items-center justify-center hover:scale-125 transition-transform shadow-lg`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              {/* Price indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatPrice(property.price)}
              </div>
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
          <div className="text-xs font-semibold mb-2">Densità Prezzi</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <span>Alta (€400K+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span>Media (€250K-400K)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Bassa (€250K-)</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tipi di Mappa</h1>
              <p className="text-gray-600 mt-2">Esplora diverse visualizzazioni geografiche delle proprietà</p>
            </div>
            
            {/* Map selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[1, 2, 3, 4].map((mapNum) => (
                <button
                  key={mapNum}
                  onClick={() => setActiveMap(mapNum)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeMap === mapNum
                      ? 'bg-white text-[#e3ae61] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mappa {mapNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeMap === 1 && (
            <>
              <ClassicPinMap />
              <ClusteredCircleMap />
            </>
          )}
          
          {activeMap === 2 && (
            <>
              <IconMarkerMap />
              <HeatmapStyleMap />
            </>
          )}
          
          {activeMap === 3 && (
            <>
              <ClassicPinMap />
              <IconMarkerMap />
            </>
          )}
          
          {activeMap === 4 && (
            <>
              <ClusteredCircleMap />
              <HeatmapStyleMap />
            </>
          )}
        </div>

        {/* All maps view */}
        {activeMap === 1 && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Tutte le Visualizzazioni</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ClassicPinMap />
              <ClusteredCircleMap />
              <IconMarkerMap />
              <HeatmapStyleMap />
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#e3ae61] mb-2">{properties.length}</div>
            <div className="text-gray-600 text-sm">Proprietà Totali</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(properties.reduce((acc, p) => acc + p.price, 0) / properties.length / 1000)}K
            </div>
            <div className="text-gray-600 text-sm">Prezzo Medio</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {new Set(properties.map(p => p.city)).size}
            </div>
            <div className="text-gray-600 text-sm">Città</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
            <div className="text-gray-600 text-sm">Tipi di Mappa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapShowcase;
