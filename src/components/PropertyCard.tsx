import React, { useState } from 'react';
import { Heart, Expand, Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, formatNumber } from '../lib/utils';
import { Button } from './Button';
import CalendarBookingModal from './CalendarBookingModal';

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

interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  onPriceRequest?: (property: Property) => void;
  onDetailsClick?: (propertyId: string) => void;
  onHover?: (property: Property | null) => void;
  isFavorited?: boolean;
  className?: string;
  showRemoveButton?: boolean;
  onRemove?: (propertyId: string) => void;
  favorites?: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavorite,
  onPriceRequest,
  onDetailsClick,
  onHover,
  isFavorited,
  className = '',
  showRemoveButton = false,
  onRemove,
  favorites = []
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toggleFavorite, user } = useAuth();

  // Determine if favorited from multiple sources
  const actuallyFavorited = isFavorited || favorites.includes(property.id) || user?.favorites.includes(property.id) || false;
  
  // Get images array and current image
  const images = property.images && property.images.length > 0 ? property.images : [property.image_url || '/images/placeholder-property.jpg'];
  const hasMultipleImages = images.length > 1;
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
        return 'bg-gray-900 text-white';
      case 'CONVENZIONATI RESIDENTI BZ':
        return 'bg-gray-600 text-white';
      case 'IN VENDITA':
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover(property);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHover) onHover(null);
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(property.id);
    }
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg==';

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative cursor-pointer h-full flex flex-col ${isHovered ? 'ring-4 ring-blue-200 ring-opacity-60 shadow-2xl -translate-y-2' : ''} ${className}`}
      onClick={() => onDetailsClick && onDetailsClick(property.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageError ? fallbackImage : imageUrl}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'group-hover:scale-105'}`}
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Badges */}
        {property.badges && property.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {property.badges.slice(0, className.includes('gap-8') || className.includes('gap-6') ? 1 : 2).map((badge, index) => (
              <span
                key={index}
                className={`text-xs font-medium uppercase tracking-wide rounded ${
                  className.includes('gap-8') || className.includes('gap-6') 
                    ? 'px-2 py-1 text-xs' 
                    : 'px-3 py-1'
                } ${getBadgeStyle(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Map Connection Indicator - Shows during hover */}
        {isHovered && (
          <div className="absolute top-3 right-16 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            MAPPA
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            actuallyFavorited 
              ? 'bg-[#e3ae61] text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-[#e3ae61]'
          }`}
          aria-label={actuallyFavorited ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          <Heart 
            className="h-5 w-5" 
            fill={actuallyFavorited ? 'currentColor' : 'none'}
          />
        </button>
        
        {/* Price Badge */}
        <div className={`absolute bottom-4 left-4 bg-[#e3ae61] text-white px-3 py-1 rounded-full font-semibold ${
          className.includes('gap-8') || className.includes('gap-6') ? 'text-sm' : 'text-lg'
        }`}>
          {formatPrice(property.price)}
        </div>
        
        {/* Price Request Button for hidden prices */}
        {property.priceHidden && (
          <button 
            className={`absolute bottom-4 left-4 bg-black bg-opacity-70 hover:bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-90'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (onPriceRequest) onPriceRequest(property);
            }}
          >
            Richiedi prezzo
          </button>
        )}
        
        {/* Image Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        
        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
            className.includes('gap-8') || className.includes('gap-6') ? 'text-lg' : 'text-xl'
          }`}>
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{locationString}</span>
          </div>
          
          {property.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
        
        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4 mb-4">
          <div className={`flex items-center ${
            className.includes('gap-8') || className.includes('gap-6') ? 'space-x-2' : 'space-x-4'
          }`}>
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
              <span>{formatNumber(area || 0)}</span>
            </div>
          </div>
          
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
            {propertyType}
          </span>
        </div>
        
        {/* Remove Button for Favorites */}
        {showRemoveButton && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveClick}
              className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Rimuovi dai Preferiti
            </Button>
          </div>
        )}

        {/* Prenota Visita Button */}
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBookingModalOpen(true);
            }}
            className="w-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Prenota Visita</span>
          </Button>
        </div>
      </div>
      
      {/* Calendar Booking Modal */}
      <CalendarBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyTitle={property.title}
        propertyId={property.id}
      />
    </div>
  );
};

export default PropertyCard;