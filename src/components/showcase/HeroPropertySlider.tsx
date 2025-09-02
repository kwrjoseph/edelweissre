import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
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

interface HeroPropertySliderProps {
  properties: Property[];
}

export function HeroPropertySlider({ properties }: HeroPropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || properties.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, properties.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (properties.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nessuna proprietà disponibile</div>;
  }

  const currentProperty = properties[currentIndex];
  const sideProperties = properties.slice(0, 3).filter((_, index) => index !== currentIndex);

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentProperty.images?.[0] || currentProperty.image_url || '/images/placeholder-property.jpg'}
          alt={currentProperty.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 min-h-[600px]">
        {/* Main Property */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="text-white mb-6">
            <div className="flex items-center mb-4">
              {currentProperty.badges?.map((badge, index) => (
                <span
                  key={index}
                  className="bg-[#e3ae61] text-white px-4 py-2 rounded-full text-sm font-medium mr-3"
                >
                  {badge}
                </span>
              ))}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif leading-tight">
              {currentProperty.title}
            </h2>
            
            <p className="text-xl text-gray-300 mb-6">
              {currentProperty.location || `${currentProperty.address}, ${currentProperty.city}`}
            </p>
            
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center">
                <span className="font-semibold">{currentProperty.bedrooms}</span>
                <span className="ml-1 text-gray-300">camere</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{currentProperty.bathrooms}</span>
                <span className="ml-1 text-gray-300">bagni</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold">{currentProperty.area || currentProperty.area_sqm}</span>
                <span className="ml-1 text-gray-300">m²</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="text-3xl font-bold text-[#e3ae61] mb-4">
                €{currentProperty.price.toLocaleString('it-IT')}
              </div>
              <button className="bg-[#e3ae61] hover:bg-[#d4a052] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Visualizza Dettagli
              </button>
            </div>
          </div>
        </div>

        {/* Side Properties */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-4 font-serif">Altre Proprietà in Evidenza</h3>
          {sideProperties.map((property, index) => (
            <div
              key={property.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={() => goToSlide(properties.findIndex(p => p.id === property.id))}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={property.images?.[0] || property.image_url || '/images/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 text-white">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{property.title}</h4>
                  <p className="text-xs text-gray-300 mb-2">{property.city}</p>
                  <div className="text-[#e3ae61] font-bold text-sm">
                    €{property.price.toLocaleString('it-IT')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={prevSlide}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={nextSlide}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#e3ae61] scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
        
        {/* Auto-play control */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`ml-4 p-2 rounded-full transition-all duration-300 ${
            isAutoPlaying
              ? 'bg-[#e3ae61] text-white'
              : 'bg-white/20 text-white/60 hover:bg-white/30'
          }`}
        >
          <Play className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}