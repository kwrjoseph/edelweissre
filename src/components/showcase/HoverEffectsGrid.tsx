import React, { useState } from 'react';
import { Heart, Share2, Eye, ArrowRight, MapPin, Bed, Bath, Square, Star, Award } from 'lucide-react';
import { formatPrice, formatNumber } from '../../lib/utils';

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

interface HoverEffectsGridProps {
  properties: Property[];
}

export function HoverEffectsGrid({ properties }: HoverEffectsGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'IN EVIDENZA':
        return 'bg-[#e3ae61] text-white';
      case 'NOVITÀ':
        return 'bg-gray-900 text-white';
      case 'CONVENZIONATI RESIDENTI BZ':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-gradient-to-r from-[#e3ae61] to-[#d4a052] text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
          <Star className="h-4 w-4 mr-2" />
          Interazioni Premium
        </div>
        <h3 className="text-2xl font-bold text-gray-900 font-serif">Effetti Hover Avanzati</h3>
        <p className="text-gray-600 mt-2">Passa il mouse sopra le carte per vedere le animazioni</p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
        {properties.slice(0, 9).map((property, index) => {
          const isHovered = hoveredProperty === property.id;
          const isFavorited = favorites.has(property.id);
          const images = property.images || [property.image_url || '/images/placeholder-property.jpg'];
          
          return (
            <div
              key={property.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full flex flex-col"
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isFavorited
                          ? 'bg-[#e3ae61] text-white shadow-lg'
                          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-110">
                      <Share2 className="h-5 w-5" />
                    </button>
                    
                    <button className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-110">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Detailed Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <Bed className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-lg font-bold">{property.bedrooms}</div>
                        <div className="text-xs text-gray-300">Camere</div>
                      </div>
                      <div className="text-center">
                        <Bath className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-lg font-bold">{property.bathrooms}</div>
                        <div className="text-xs text-gray-300">Bagni</div>
                      </div>
                      <div className="text-center">
                        <Square className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-lg font-bold">{property.area || property.area_sqm}</div>
                        <div className="text-xs text-gray-300">m²</div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-[#e3ae61] hover:bg-[#d4a052] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group">
                      Visualizza Dettagli
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  {property.badges?.slice(0, 2).map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1 ${getBadgeStyle(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                
                {/* Price Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-[#e3ae61] text-white px-3 py-2 rounded-xl font-bold text-lg shadow-lg">
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 mt-auto">
                <h4 className="text-lg font-bold text-gray-900 mb-2 font-serif group-hover:text-[#e3ae61] transition-colors duration-300 line-clamp-2">
                  {property.title}
                </h4>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {property.location || `${property.city}`}
                  </span>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{formatNumber(property.area || property.area_sqm || 0)}</span>
                    </div>
                  </div>
                  
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {property.propertyType || property.property_type}
                  </span>
                </div>
              </div>
              
              {/* Animated Border Effect */}
              <div className={`absolute inset-0 border-4 border-[#e3ae61] rounded-2xl transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}></div>
            </div>
          );
        })}
      </div>
      
      {/* Interactive Stats */}
      <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold mb-2 font-serif">Statistiche Interattive</h4>
          <p className="text-gray-300">Le tue interazioni con le proprietà</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-[#e3ae61] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Heart className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold mb-1">{favorites.size}</div>
            <div className="text-gray-300 text-sm">Preferiti Aggiunti</div>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Eye className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold mb-1">{hoveredProperty ? properties.findIndex(p => p.id === hoveredProperty) + 1 : 0}</div>
            <div className="text-gray-300 text-sm">Proprietà Visualizzata</div>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold mb-1">{properties.filter(p => p.featured).length}</div>
            <div className="text-gray-300 text-sm">In Evidenza</div>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8" />
            </div>
            <div className="text-2xl font-bold mb-1">{Math.round(Math.random() * 5 * 10) / 10}</div>
            <div className="text-gray-300 text-sm">Rating Medio</div>
          </div>
        </div>
      </div>
    </div>
  );
}