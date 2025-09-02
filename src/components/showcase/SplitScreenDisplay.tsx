import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Share2, Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
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

interface SplitScreenDisplayProps {
  properties: Property[];
}

export function SplitScreenDisplay({ properties }: SplitScreenDisplayProps) {
  const [currentProperty, setCurrentProperty] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  const property = properties[currentProperty];
  const images = property.images || [property.image_url || '/images/placeholder-property.jpg'];

  const nextProperty = () => {
    setCurrentProperty((prev) => (prev + 1) % properties.length);
    setCurrentImageIndex(0);
  };

  const prevProperty = () => {
    setCurrentProperty((prev) => (prev - 1 + properties.length) % properties.length);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'IN EVIDENZA':
        return 'bg-[#e3ae61] text-white';
      case 'NOVITÀ':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Image Gallery Side */}
        <div className="relative bg-gray-900">
          {/* Main Image */}
          <div className="relative h-full">
            <img
              src={images[currentImageIndex]}
              alt={`${property.title} - Immagine ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation Overlay */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <button className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-200">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-[#e3ae61] shadow-lg'
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Details Side */}
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Property Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                Proprietà {currentProperty + 1} di {properties.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevProperty}
                  disabled={currentProperty === 0}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextProperty}
                  disabled={currentProperty === properties.length - 1}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Badges */}
            <div className="mb-4">
              {property.badges?.map((badge, index) => (
                <span
                  key={index}
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${getBadgeStyle(badge)}`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Property Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-serif">
              {property.title}
            </h3>
            
            {/* Location */}
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">
                {property.location || `${property.address}, ${property.city}`}
              </span>
            </div>
            
            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Bed className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-500">Camere</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Bath className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-500">Bagni</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Square className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.area || property.area_sqm}</div>
                <div className="text-sm text-gray-500">m²</div>
              </div>
            </div>
            
            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Descrizione</h4>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>
          
          {/* Price and Actions */}
          <div>
            <div className="text-4xl font-bold text-[#e3ae61] mb-6">
              {formatPrice(property.price)}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`flex items-center px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isFavorited
                    ? 'bg-[#e3ae61] border-[#e3ae61] text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#e3ae61]'
                }`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Nei Preferiti' : 'Aggiungi'}
              </button>
              
              <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Contatta Agente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}