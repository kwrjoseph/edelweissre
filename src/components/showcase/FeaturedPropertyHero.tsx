import React, { useState } from 'react';
import { ArrowRight, Star, Calendar, Eye } from 'lucide-react';
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

interface FeaturedPropertyHeroProps {
  properties: Property[];
}

export function FeaturedPropertyHero({ properties }: FeaturedPropertyHeroProps) {
  const [selectedProperty, setSelectedProperty] = useState(0);
  
  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  const mainProperty = properties[selectedProperty];
  const sideProperties = properties.filter((_, index) => index !== selectedProperty).slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[700px]">
        {/* Main Featured Property - 2/3 width */}
        <div className="lg:col-span-2 relative group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={mainProperty.images?.[0] || mainProperty.image_url || '/images/placeholder-property.jpg'}
              alt={mainProperty.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
            {/* Badges */}
            <div className="mb-4">
              {mainProperty.badges?.map((badge, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#e3ae61] text-white px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Property Info */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
              {mainProperty.title}
            </h2>
            
            <p className="text-lg text-gray-200 mb-6">
              {mainProperty.location || `${mainProperty.address}, ${mainProperty.city}`}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{mainProperty.bedrooms}</div>
                <div className="text-sm text-gray-300">Camere</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{mainProperty.bathrooms}</div>
                <div className="text-sm text-gray-300">Bagni</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{mainProperty.area || mainProperty.area_sqm}</div>
                <div className="text-sm text-gray-300">m²</div>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-[#e3ae61]">
                €{mainProperty.price.toLocaleString('it-IT')}
              </div>
              <button className="bg-[#e3ae61] hover:bg-[#d4a052] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center group">
                Esplora
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Image Gallery Indicators */}
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
            <Eye className="h-4 w-4 inline mr-1" />
            {mainProperty.images?.length || 1} foto
          </div>
        </div>

        {/* Side Properties - 1/3 width */}
        <div className="bg-gray-50 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-serif">Altre Selezioni</h3>
            <Star className="h-5 w-5 text-[#e3ae61]" />
          </div>
          
          <div className="space-y-4">
            {sideProperties.map((property, index) => (
              <div
                key={property.id}
                className={`bg-white rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  selectedProperty === properties.findIndex(p => p.id === property.id)
                    ? 'border-[#e3ae61] shadow-lg'
                    : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => setSelectedProperty(properties.findIndex(p => p.id === property.id))}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                      {property.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{property.city}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-[#e3ae61] font-bold text-sm">
                        €{property.price.toLocaleString('it-IT')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {property.bedrooms}c • {property.bathrooms}b
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group">
            Visualizza Tutte
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{properties.length}</div>
                <div className="text-xs text-gray-500">Proprietà</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {new Set(properties.map(p => p.city)).size}
                </div>
                <div className="text-xs text-gray-500">Città</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}