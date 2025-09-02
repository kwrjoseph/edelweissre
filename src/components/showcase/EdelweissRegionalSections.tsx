import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
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

interface EdelweissRegionalSectionsProps {
  properties: Property[];
}

const regions = [
  { name: 'Dolomiti', description: 'Proprietà alpine di lusso' },
  { name: 'Toscana', description: 'Ville e casali toscani' },
  { name: 'Lombardia', description: 'Immobili urbani premium' },
  { name: 'Veneto', description: 'Eleganza veneziana' },
  { name: 'Lazio', description: 'Residenze nella capitale' },
  { name: 'Campania', description: 'Vista mare e collina' }
];

export function EdelweissRegionalSections({ properties }: EdelweissRegionalSectionsProps) {
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  const propertiesPerPage = 4;

  // Group properties by region
  const groupedProperties = regions.reduce((acc, region) => {
    acc[region.name] = properties.filter(p => 
      p.region?.includes(region.name) || 
      p.address?.includes(region.name) ||
      p.city?.toLowerCase().includes(region.name.toLowerCase())
    );
    // If no properties for region, assign some properties for demo
    if (acc[region.name].length === 0) {
      const startIndex = Object.keys(acc).length * 2;
      acc[region.name] = properties.slice(startIndex, startIndex + 6);
    }
    return acc;
  }, {} as Record<string, Property[]>);

  const getCurrentPageProperties = (regionName: string) => {
    const regionProperties = groupedProperties[regionName] || [];
    const currentPage = currentPages[regionName] || 0;
    const startIndex = currentPage * propertiesPerPage;
    return regionProperties.slice(startIndex, startIndex + propertiesPerPage);
  };

  const getTotalPages = (regionName: string) => {
    const regionProperties = groupedProperties[regionName] || [];
    return Math.ceil(regionProperties.length / propertiesPerPage);
  };

  const nextPage = (regionName: string) => {
    const totalPages = getTotalPages(regionName);
    setCurrentPages(prev => ({
      ...prev,
      [regionName]: Math.min((prev[regionName] || 0) + 1, totalPages - 1)
    }));
  };

  const prevPage = (regionName: string) => {
    setCurrentPages(prev => ({
      ...prev,
      [regionName]: Math.max((prev[regionName] || 0) - 1, 0)
    }));
  };

  return (
    <div className="space-y-16">
      {regions.map((region) => {
        const regionProperties = getCurrentPageProperties(region.name);
        const currentPage = currentPages[region.name] || 0;
        const totalPages = getTotalPages(region.name);
        
        return (
          <div key={region.name} className="bg-white rounded-3xl shadow-lg p-8">
            {/* Region Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2 font-serif flex items-center">
                  <MapPin className="h-8 w-8 text-[#e3ae61] mr-3" />
                  {region.name}
                </h3>
                <p className="text-gray-600 text-lg">{region.description}</p>
              </div>
              
              {/* Region Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e3ae61]">{groupedProperties[region.name]?.length || 0}</div>
                  <div className="text-sm text-gray-500">Proprietà</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{currentPage + 1}/{totalPages}</div>
                  <div className="text-sm text-gray-500">Pagina</div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
              {regionProperties.map((property) => (
                <div key={property.id} className="h-full">
                  <PropertyCard
                    property={property}
                    className="h-full flex flex-col transform transition-all duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => prevPage(region.name)}
                  disabled={currentPage === 0}
                  className="flex items-center px-6 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Precedente
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPages(prev => ({ ...prev, [region.name]: i }))}
                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                        i === currentPage
                          ? 'bg-[#e3ae61] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => nextPage(region.name)}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center px-6 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Successiva
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}