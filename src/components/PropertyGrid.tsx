import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import PropertyCard from './PropertyCard';
import PropertyList from './PropertyList';
import MobilePropertyCard from './MobilePropertyCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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

interface PropertyGridProps {
  properties: Property[];
  onPropertyHover: (property: Property | null) => void;
  onFavoriteToggle: (propertyId: string) => void;
  onPriceRequest: (property: Property) => void;
  onPropertyDetailsClick: (propertyId: string) => void;
  favorites: string[];
  viewMode: 'grid' | 'list';
  className?: string;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  onPropertyHover,
  onFavoriteToggle,
  onPriceRequest,
  onPropertyDetailsClick,
  favorites,
  viewMode,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(1.5);
      } else {
        setSlidesPerView(2);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (properties.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            Nessuna proprietà trovata
          </h3>
          <p className="text-secondary">
            Modifica i filtri di ricerca per trovare nuove proprietà
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout
  if (!isMobile) {
    if (viewMode === 'list') {
      return (
        <PropertyList
          properties={properties}
          onPropertyHover={onPropertyHover}
          onFavoriteToggle={onFavoriteToggle}
          onPriceRequest={onPriceRequest}
          onPropertyDetailsClick={onPropertyDetailsClick}
          favorites={favorites}
          className={className}
        />
      );
    }
    
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr ${className}`}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onFavorite={onFavoriteToggle}
            onPriceRequest={onPriceRequest}
            onDetailsClick={onPropertyDetailsClick}
            isFavorited={favorites.includes(property.id)}
            onHover={onPropertyHover}
            className="animate-fadeIn h-full flex flex-col"
          />
        ))}
      </div>
    );
  }

  // Mobile vertical scrolling layout - Zillow style
  return (
    <div className={`${className} space-y-4`}>
      {properties.map((property) => (
        <MobilePropertyCard
          key={property.id}
          property={property}
          onFavorite={onFavoriteToggle}
          onPriceRequest={onPriceRequest}
          onDetailsClick={onPropertyDetailsClick}
          isFavorited={favorites.includes(property.id)}
          favorites={favorites}
          className="animate-fadeIn"
        />
      ))}
    </div>
  );
};

export default PropertyGrid;