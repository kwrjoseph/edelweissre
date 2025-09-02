import React from 'react';
import { TrendingUp, Award, Eye } from 'lucide-react';
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

interface MagazineLayoutProps {
  properties: Property[];
}

export function MagazineLayout({ properties }: MagazineLayoutProps) {
  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  // Sort properties to prioritize featured ones
  const sortedProperties = [...properties].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const mainProperty = sortedProperties[0];
  const secondaryProperties = sortedProperties.slice(1, 4);
  const smallProperties = sortedProperties.slice(4, 8);

  return (
    <div className="space-y-8">
      {/* Magazine Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-[#e3ae61] text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
          <Award className="h-4 w-4 mr-2" />
          Selezione Esclusiva
        </div>
        <h3 className="text-2xl font-bold text-gray-900 font-serif">Proprietà del Mese</h3>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Large Featured Property */}
        <div className="lg:col-span-2 lg:row-span-2">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden h-full group">
            <div className="aspect-w-16 aspect-h-12 relative">
              <img
                src={mainProperty.images?.[0] || mainProperty.image_url || '/images/placeholder-property.jpg'}
                alt={mainProperty.title}
                className="w-full h-96 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4">
                {mainProperty.badges?.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-block bg-[#e3ae61] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h4 className="text-2xl font-bold mb-2 font-serif">{mainProperty.title}</h4>
                <p className="text-gray-200 mb-4">
                  {mainProperty.location || `${mainProperty.city}`}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#e3ae61]">
                    €{mainProperty.price.toLocaleString('it-IT')}
                  </div>
                  <div className="text-sm text-gray-300">
                    {mainProperty.bedrooms}c • {mainProperty.bathrooms}b • {mainProperty.area || mainProperty.area_sqm}m²
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medium Properties */}
        <div className="space-y-6">
          {secondaryProperties.slice(0, 2).map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h5 className="font-semibold text-sm mb-1">{property.title}</h5>
                  <div className="text-[#e3ae61] font-bold text-lg">
                    €{property.price.toLocaleString('it-IT')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small Properties */}
        <div className="space-y-6">
          {smallProperties.slice(0, 2).map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h5 className="font-semibold text-sm mb-1 line-clamp-1">{property.title}</h5>
                  <div className="text-[#e3ae61] font-bold text-sm">
                    €{property.price.toLocaleString('it-IT')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row - Additional Properties with Better Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {sortedProperties.slice(8, 12).map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
            <div className="relative flex-1">
              <img
                src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                alt={property.title}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Compact badges */}
              <div className="absolute top-2 left-2">
                {property.badges?.slice(0, 1).map((badge, index) => (
                  <span
                    key={index}
                    className="inline-block bg-[#e3ae61] text-white px-2 py-1 rounded text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            {/* Details at bottom */}
            <div className="p-4 mt-auto">
              <h6 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {property.title}
              </h6>
              <p className="text-xs text-gray-500 mb-3">{property.city}</p>
              <div className="flex items-center justify-between text-xs mb-2">
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
        ))}
      </div>

      {/* Magazine Stats */}
      <div className="bg-gradient-to-r from-[#e3ae61] to-[#d4a052] rounded-2xl p-8 text-white text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <TrendingUp className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              +{Math.round(Math.random() * 20 + 10)}%
            </div>
            <div className="text-white/80 text-sm">Interesse Mensile</div>
          </div>
          <div>
            <Eye className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {(Math.round(Math.random() * 500 + 200)).toLocaleString()}
            </div>
            <div className="text-white/80 text-sm">Visualizzazioni</div>
          </div>
          <div>
            <Award className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">{properties.filter(p => p.featured).length}</div>
            <div className="text-white/80 text-sm">In Evidenza</div>
          </div>
        </div>
      </div>
    </div>
  );
}