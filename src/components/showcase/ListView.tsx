import React, { useState } from 'react';
import { Bed, Bath, Square, MapPin, Filter, SortAsc } from 'lucide-react';
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

interface ListViewProps {
  properties: Property[];
}

export function ListView({ properties }: ListViewProps) {
  const [sortBy, setSortBy] = useState<'price' | 'area' | 'bedrooms'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedProperties = [...properties].sort((a, b) => {
    let aValue: number, bValue: number;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'area':
        aValue = a.area || a.area_sqm || 0;
        bValue = b.area || b.area_sqm || 0;
        break;
      case 'bedrooms':
        aValue = a.bedrooms;
        bValue = b.bedrooms;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Sorting */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Elenco Proprietà</h3>
            <p className="text-gray-600 text-sm">{properties.length} proprietà disponibili</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#e3ae61] focus:border-transparent"
              >
                <option value="price-desc">Prezzo: Alto a Basso</option>
                <option value="price-asc">Prezzo: Basso ad Alto</option>
                <option value="area-desc">Area: Grande a Piccola</option>
                <option value="area-asc">Area: Piccola a Grande</option>
                <option value="bedrooms-desc">Camere: Più a Meno</option>
                <option value="bedrooms-asc">Camere: Meno a Più</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="divide-y divide-gray-200">
        {sortedProperties.map((property, index) => (
          <div
            key={property.id}
            className="p-6 hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property Image */}
              <div className="md:w-72 lg:w-80">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    {property.badges?.slice(0, 2).map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className={`inline-block px-2 py-1 rounded text-xs font-medium mr-1 mb-1 ${getBadgeStyle(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-serif group-hover:text-[#e3ae61] transition-colors">
                    {property.title}
                  </h4>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{property.location || `${property.address}, ${property.city}`}</span>
                  </div>
                  
                  {property.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                  
                  {/* Property Features */}
                  <div className="flex items-center space-x-6 text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="font-medium">{property.bedrooms}</span>
                      <span className="ml-1 text-sm">camere</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="font-medium">{property.bathrooms}</span>
                      <span className="ml-1 text-sm">bagni</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span className="font-medium">{formatNumber(property.area || property.area_sqm || 0)}</span>
                      <span className="ml-1 text-sm">m²</span>
                    </div>
                  </div>
                </div>
                
                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-[#e3ae61] mb-1">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.propertyType || property.property_type} • {property.contractType}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                      Preferiti
                    </button>
                    <button className="bg-[#e3ae61] hover:bg-[#d4a052] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                      Dettagli
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Visualizzate {Math.min(properties.length, 10)} di {properties.length} proprietà
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Precedente
          </button>
          <span className="px-3 py-2 bg-[#e3ae61] text-white rounded-lg text-sm font-medium">1</span>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Successiva
          </button>
        </div>
      </div>
    </div>
  );
}