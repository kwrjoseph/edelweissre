import React from 'react';
import { Heart } from 'lucide-react';
import PropertyCard from '../PropertyCard';
import { Skeleton } from '../Skeleton';
import { Button } from '../Button';

// Hook to get properties data for preview
function usePreviewProperties() {
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // First try to get from main platform data
        let response = await fetch('/data/properties.json');
        if (!response.ok) {
          // Fallback to mock data
          response = await fetch('/data/mockProperties.json');
        }
        const data = await response.json();
        
        // Convert data format to match dashboard expectations
        const convertedData = data.map((property: any) => ({
          id: property.id,
          title: property.title,
          description: property.description || `${property.propertyType} in ${property.city}`,
          price: property.price,
          location: `${property.city}, ${property.region}`,
          image_url: property.images ? property.images[0] : property.image_url,
          images: property.images,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area_sqm: property.area,
          area: property.area,
          property_type: property.propertyType || property.property_type,
          propertyType: property.propertyType || property.property_type,
          city: property.city,
          region: property.region,
          address: property.address
        }));
        
        setProperties(convertedData);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, loading };
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

export function PreviewFavoritesSection() {
  const { properties, loading } = usePreviewProperties();
  
  // Mock favorites - show first 4 properties as favorites for preview (to demonstrate 2x2 grid)
  const favoriteProperties = properties.slice(0, 4);

  const handleRemoveFromFavorites = (propertyId: string) => {
    alert('Demo: In una versione reale, questa proprietà verrebbe rimossa dai preferiti.');
  };

  const handleStartSearching = () => {
    // Navigate back to main platform
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">I Miei Preferiti</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
          {Array.from({ length: 4 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">I Miei Preferiti</h2>
        <div className="py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessuna proprietà salvata
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Non hai ancora salvato nessuna proprietà. Inizia la tua ricerca e clicca sull'icona a forma di cuore per salvare i tuoi preferiti!
          </p>
          <Button onClick={handleStartSearching}>
            Inizia la Ricerca
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">I Miei Preferiti</h2>
        <div className="text-sm text-gray-500">
          {favoriteProperties.length} proprietà salvate
        </div>
      </div>
      
      {/* Custom 2-column grid layout for favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
        {favoriteProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showRemoveButton={true}
            onRemove={handleRemoveFromFavorites}
            className="h-full flex flex-col"
          />
        ))}
      </div>
    </div>
  );
}