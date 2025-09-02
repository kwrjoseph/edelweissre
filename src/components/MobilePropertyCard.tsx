import React, { useState } from 'react';
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, formatNumber } from '../lib/utils';

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
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: string[];
  image_url?: string;
  badges?: string[];
  featured?: boolean;
  isNew?: boolean;
  price: number;
  priceHidden?: boolean;
  description?: string;
  energyRating?: string;
}

interface MobilePropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  onPriceRequest?: (property: Property) => void;
  onDetailsClick?: (propertyId: string) => void;
  onHover?: (property: Property | null) => void;
  isFavorited?: boolean;
  className?: string;
  favorites?: string[];
}

const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  property,
  onFavorite,
  onPriceRequest,
  onDetailsClick,
  isFavorited,
  className = '',
  favorites = []
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleFavorite, user } = useAuth();

  // Determine if favorited from multiple sources
  const actuallyFavorited = isFavorited || favorites.includes(property.id) || user?.favorites.includes(property.id) || false;
  
  // Get images array and current image
  const images = property.images && property.images.length > 0 ? property.images : [property.image_url || '/images/placeholder-property.jpg'];
  const imageUrl = images[currentImageIndex] || images[0];
    
  // Get location from either format
  const locationString = property.location || `${property.address}, ${property.city}`;
  
  // Get property type from either format
  const propertyType = property.property_type || property.propertyType;
  
  // Get area from either format
  const area = property.area_sqm || property.area;

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'IN EVIDENZA':
        return 'bg-[#e3ae61] text-white';
      case 'NOVITÀ':
        return 'bg-blue-600 text-white';
      case 'CONVENZIONATI RESIDENTI BZ':
        return 'bg-green-600 text-white';
      case 'IN VENDITA':
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFavorite) {
      onFavorite(property.id);
    } else {
      toggleFavorite(property.id);
    }
  };

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg==';

  // Get first two most important badges
  const displayBadges = property.badges ? property.badges.slice(0, 2) : [];
  
  // Check if there are recent updates
  const hasUpdatedBadge = property.badges?.some(badge => badge.includes('Aggiornato') || badge.includes('Updated') || property.isNew);

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 ${className}`}
      onClick={() => onDetailsClick && onDetailsClick(property.id)}
    >
      {/* Large Image Container - Zillow style */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        <img
          src={imageError ? fallbackImage : imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Top Left Badges - Stacked */}
        {displayBadges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {displayBadges.map((badge, index) => (
              <span
                key={index}
                className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md ${getBadgeStyle(badge)}`}
              >
                {badge === 'CONVENZIONATI RESIDENTI BZ' ? 'CONV. RES. BZ' : badge}
              </span>
            ))}
            {hasUpdatedBadge && !displayBadges.some(b => b.includes('Aggiornato')) && (
              <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-green-600 text-white">
                Aggiornato ieri
              </span>
            )}
          </div>
        )}
        
        {/* Top Right Heart Icon */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 shadow-lg ${
            actuallyFavorited 
              ? 'bg-[#e3ae61] text-white' 
              : 'bg-white/90 text-gray-700 hover:bg-white hover:text-[#e3ae61]'
          }`}
          aria-label={actuallyFavorited ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          <Heart 
            className="h-5 w-5" 
            fill={actuallyFavorited ? 'currentColor' : 'none'}
          />
        </button>
        
        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section - Zillow style */}
      <div className="p-4">
        {/* Price - Large and prominent */}
        <div className="mb-2">
          {property.priceHidden ? (
            <button 
              className="text-xl font-bold text-gray-900 hover:text-[#e3ae61] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onPriceRequest) onPriceRequest(property);
              }}
            >
              Richiedi prezzo
            </button>
          ) : (
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
          )}
        </div>

        {/* Property Details Row - beds, baths, sqft */}
        <div className="flex items-center text-gray-600 text-sm mb-3 gap-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span className="font-medium">{property.bedrooms} cam</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span className="font-medium">{property.bathrooms} bagni</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span className="font-medium">{formatNumber(area || 0)} mq</span>
          </div>
        </div>

        {/* Property Type and Contract Type */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{propertyType}</span>
          <span className="mx-2">•</span>
          <span>{property.contractType}</span>
          {property.featured && (
            <>
              <span className="mx-2">•</span>
              <span className="text-[#e3ae61] font-medium">In Evidenza</span>
            </>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700 line-clamp-2">
            {locationString}
          </div>
        </div>

        {/* Property Type */}
        <div className="text-sm text-gray-500">
          {propertyType} • {property.contractType}
        </div>
      </div>
    </div>
  );
};

export default MobilePropertyCard;