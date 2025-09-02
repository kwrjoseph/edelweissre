import React, { useState } from 'react';
import { Heart, Expand, Bed, Bath, Square, MapPin } from 'lucide-react';

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

interface PropertyListProps {
  properties: Property[];
  onPropertyHover: (property: Property | null) => void;
  onFavoriteToggle: (propertyId: string) => void;
  onPriceRequest: (property: Property) => void;
  onPropertyDetailsClick: (propertyId: string) => void;
  favorites: string[];
  className?: string;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  onPropertyHover,
  onFavoriteToggle,
  onPriceRequest,
  onPropertyDetailsClick,
  favorites,
  className = ''
}) => {
  const [hoveredProperties, setHoveredProperties] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'IN EVIDENZA':
        return 'bg-accent text-white';
      case 'NOVITÀ':
        return 'bg-badge-black text-white';
      case 'CONVENZIONATI RESIDENTI BZ':
        return 'bg-badge-gray text-white';
      case 'IN VENDITA':
      default:
        return 'bg-badge-gray text-white';
    }
  };

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

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg==';

  const handlePropertyHover = (property: Property, isHovered: boolean) => {
    setHoveredProperties(prev => ({ ...prev, [property.id]: isHovered }));
    onPropertyHover(isHovered ? property : null);
  };

  const handleImageError = (propertyId: string) => {
    setImageErrors(prev => ({ ...prev, [propertyId]: true }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {properties.map((property) => {

        return (
          <div 
            key={property.id}
            className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer animate-fadeIn"
            onClick={() => onPropertyDetailsClick(property.id)}
            onMouseEnter={() => handlePropertyHover(property, true)}
            onMouseLeave={() => handlePropertyHover(property, false)}
          >
            <div className="flex">
              {/* Image Section */}
              <div className="relative w-1/3 h-48">
                <img
                  src={imageErrors[property.id] ? fallbackImage : property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(property.id)}
                  loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {property.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium uppercase tracking-wide rounded ${getBadgeStyle(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Interactive Icons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoriteToggle(property.id);
                    }}
                    className="w-8 h-8 bg-white rounded-full shadow-icon flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Aggiungi ai preferiti"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(property.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                  </button>
                  <button
                    className="w-8 h-8 bg-white rounded-full shadow-icon flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Espandi immagine"
                  >
                    <Expand className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Price Registration Button - Bottom Left */}
                {property.priceHidden && (
                  <button 
                    className={`absolute bottom-4 left-4 bg-black bg-opacity-70 hover:bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      hoveredProperties[property.id] ? 'opacity-100' : 'opacity-90'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceRequest(property);
                    }}
                  >
                    Richiedi prezzo
                  </button>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    {/* Address */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <p className="text-secondary text-sm">
                        {property.address}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Property Details - Above property type */}
                <div className="flex items-center gap-6 mb-5">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-secondary" />
                    <span className="text-primary font-medium">{property.bedrooms}</span>
                    <span className="text-secondary text-sm">camere</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-secondary" />
                    <span className="text-primary font-medium">{property.bathrooms}</span>
                    <span className="text-secondary text-sm">bagni</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-secondary" />
                    <span className="text-primary font-medium">{property.area}</span>
                    <span className="text-secondary text-sm">mq</span>
                  </div>
                </div>
                
                {/* Bottom Row: Property Type (Left) and Details Button (Right) */}
                <div className="flex items-center justify-between pt-2">
                  {/* Property Type - LEFT aligned */}
                  <p className="text-secondary text-xs uppercase tracking-wide font-medium">
                    {property.propertyType}
                  </p>
                  
                  {/* Details Button - RIGHT aligned */}
                  <button 
                    className="bg-accent text-white py-2 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPropertyDetailsClick(property.id);
                    }}
                  >
                    Dettagli
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;