import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import PropertyCard from './PropertyCard';
import { Skeleton } from './Skeleton';
import { Button } from './Button';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  property_type: string;
}

interface PropertySliderProps {
  properties: Property[];
  loading?: boolean;
  title?: string;
  showRemoveButton?: boolean;
  onRemove?: (propertyId: string) => void;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PropertySlider({ 
  properties, 
  loading = false, 
  title,
  showRemoveButton = false,
  onRemove,
  emptyMessage,
  emptyActionText,
  onEmptyAction
}: PropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, properties.length - itemsPerView);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Reset index when properties change
  useEffect(() => {
    setCurrentIndex(0);
  }, [properties.length]);

  if (loading) {
    return (
      <div className="p-8">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="p-8 text-center">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        )}
        <div className="py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessuna proprietà salvata
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {emptyMessage || 'Non hai ancora salvato nessuna proprietà. Inizia la tua ricerca e clicca sull\'icona a forma di cuore per salvare i tuoi preferiti!'}
          </p>
          {emptyActionText && onEmptyAction && (
            <Button onClick={onEmptyAction}>
              {emptyActionText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="text-sm text-gray-500">
            {properties.length} proprietà salvate
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Navigation Buttons */}
        {properties.length > itemsPerView && (
          <>
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={cn(
                'absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-200',
                canGoPrev 
                  ? 'text-gray-700 hover:text-[#e3ae61] hover:shadow-xl' 
                  : 'text-gray-300 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={cn(
                'absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-200',
                canGoNext 
                  ? 'text-gray-700 hover:text-[#e3ae61] hover:shadow-xl' 
                  : 'text-gray-300 cursor-not-allowed'
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Properties Grid */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(properties.length / itemsPerView) * 100}%`
            }}
          >
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="flex-shrink-0"
                style={{ width: `${100 / properties.length * itemsPerView}%` }}
              >
                <PropertyCard
                  property={property}
                  showRemoveButton={showRemoveButton}
                  onRemove={onRemove}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Dots Indicator */}
        {properties.length > itemsPerView && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors duration-200',
                  index === currentIndex ? 'bg-[#e3ae61]' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}