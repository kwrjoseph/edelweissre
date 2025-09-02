import React, { useState } from 'react';
import { Grid3X3, Grid2X2, LayoutGrid, Layers } from 'lucide-react';
import PropertyCard from '../PropertyCard';

interface Property {
  id: string;
  title: string;
  address?: string;
  city?: string;
  region?: string;
  location?: string;
  propertyType?: string;
  property_type?: string;
  contractType?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  area_sqm?: number;
  coordinates?: { lat: number; lng: number; };
  images?: string[];
  image_url?: string;
  badges?: string[];
  featured?: boolean;
  isNew?: boolean;
  price: number;
  priceHidden?: boolean;
  description?: string;
}

interface GridLayoutsProps {
  properties: Property[];
}

const gridTypes = [
  { id: '2x2', name: '2x2 Grid', icon: Grid2X2, description: 'Griglia 2x2 per evidenziare 4 proprietà principali' },
  { id: '3x3', name: '3x3 Grid', icon: Grid3X3, description: 'Griglia 3x3 per una panoramica completa' },
  { id: 'masonry', name: 'Masonry', icon: LayoutGrid, description: 'Layout dinamico con altezze variabili' },
  { id: 'pinterest', name: 'Pinterest Style', icon: Layers, description: 'Stile Pinterest con disposizione sfalsata' },
];

export function GridLayouts({ properties }: GridLayoutsProps) {
  const [activeGrid, setActiveGrid] = useState('2x2');

  const renderGrid = () => {
    switch (activeGrid) {
      case '2x2':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.slice(0, 4).map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard
                  property={property}
                  className="h-full flex flex-col transform transition-all duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        );
      
      case '3x3':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 9).map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard
                  property={property}
                  className="h-full flex flex-col transform transition-all duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        );
      
      case 'masonry':
        return (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {properties.slice(0, 12).map((property, index) => (
              <div key={property.id} className="break-inside-avoid mb-6">
                <PropertyCard
                  property={property}
                  className={`transform transition-all duration-300 hover:scale-105 ${
                    index % 3 === 0 ? 'h-auto' : index % 3 === 1 ? 'h-auto' : 'h-auto'
                  }`}
                />
              </div>
            ))}
          </div>
        );
      
      case 'pinterest':
        return (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {properties.slice(0, 12).map((property, index) => (
              <div key={property.id} className="break-inside-avoid mb-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                      alt={property.title}
                      className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        index % 4 === 0 ? 'h-64' : index % 4 === 1 ? 'h-48' : index % 4 === 2 ? 'h-72' : 'h-56'
                      }`}
                    />
                    {/* Compact badges */}
                    <div className="absolute top-2 left-2">
                      {property.badges?.slice(0, 1).map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className="inline-block bg-[#e3ae61] text-white px-2 py-1 rounded text-xs font-medium"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Details at bottom - no overlay */}
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {property.title}
                    </h5>
                    <p className="text-xs text-gray-500 mb-3">{property.city}</p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="text-[#e3ae61] font-bold">
                        €{property.price.toLocaleString('it-IT')}
                      </div>
                      <div className="text-gray-400">
                        {property.bedrooms}c • {property.bathrooms}b
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.area || property.area_sqm}m² • {property.propertyType || property.property_type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Grid Type Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {gridTypes.map((gridType) => {
          const IconComponent = gridType.icon;
          return (
            <button
              key={gridType.id}
              onClick={() => setActiveGrid(gridType.id)}
              className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 ${
                activeGrid === gridType.id
                  ? 'bg-[#e3ae61] text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{gridType.name}</div>
                <div className="text-xs opacity-80">{gridType.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Grid Layout */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            {gridTypes.find(g => g.id === activeGrid)?.name}
          </h4>
          <p className="text-gray-600">
            {gridTypes.find(g => g.id === activeGrid)?.description}
          </p>
        </div>
        
        {renderGrid()}
      </div>
    </div>
  );
}