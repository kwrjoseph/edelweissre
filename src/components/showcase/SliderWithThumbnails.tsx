import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, MapPin, Bed, Bath, Square } from 'lucide-react';
import PropertyCard from '../PropertyCard';
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

interface SliderWithThumbnailsProps {
  properties: Property[];
}

export function SliderWithThumbnails({ properties }: SliderWithThumbnailsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
      setCurrentImageIndex(0);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, properties.length]);

  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  const property = properties[currentIndex];
  const images = property.images || [property.image_url || '/images/placeholder-property.jpg'];

  const nextProperty = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
    setCurrentImageIndex(0);
    setIsAutoPlay(false);
  };

  const prevProperty = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
    setCurrentImageIndex(0);
    setIsAutoPlay(false);
  };

  const goToProperty = (index: number) => {
    setCurrentIndex(index);
    setCurrentImageIndex(0);
    setIsAutoPlay(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Main Display */}
      <div className="relative h-[500px] bg-gray-900">
        {/* Main Image */}
        <img
          src={images[currentImageIndex]}
          alt={`${property.title} - Immagine ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        
        {/* Property Navigation */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={prevProperty}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentIndex + 1} / {properties.length}
          </div>
          
          <button
            onClick={nextProperty}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Image Navigation for current property */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
              className="pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 opacity-0 hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-200 mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{property.location || `${property.city}`}</span>
              </div>
              <div className="text-2xl font-bold text-[#e3ae61]">
                {formatPrice(property.price)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
              >
                {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Thumbnails Navigation */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Sfoglia Proprietà</h4>
          <div className="text-sm text-gray-500">
            {properties.length} proprietà disponibili
          </div>
        </div>
        
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {properties.map((prop, index) => (
            <button
              key={prop.id}
              onClick={() => goToProperty(index)}
              className={`flex-shrink-0 group transition-all duration-300 ${
                index === currentIndex ? 'transform scale-105' : 'hover:transform hover:scale-105'
              }`}
            >
              <div className={`relative w-24 h-18 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-[#e3ae61] shadow-lg'
                  : 'border-gray-200 group-hover:border-gray-300'
              }`}>
                <img
                  src={prop.images?.[0] || prop.image_url || '/images/placeholder-property.jpg'}
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-[#e3ae61]/20"></div>
                )}
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900 line-clamp-1">
                  {prop.title}
                </p>
                <p className="text-xs text-[#e3ae61] font-semibold">
                  {formatPrice(prop.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Property Details Summary */}
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Bed className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
            <div className="text-sm text-gray-500">Camere</div>
          </div>
          <div className="text-center">
            <Bath className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
            <div className="text-sm text-gray-500">Bagni</div>
          </div>
          <div className="text-center">
            <Square className="h-6 w-6 text-[#e3ae61] mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">{property.area || property.area_sqm}</div>
            <div className="text-sm text-gray-500">m²</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-2">
              {property.propertyType || property.property_type}
            </div>
            <div className="text-sm text-gray-500">Tipologia</div>
          </div>
        </div>
      </div>
    </div>
  );
}