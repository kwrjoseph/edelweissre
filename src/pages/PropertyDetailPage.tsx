import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Share2, MapPin, Home, Bed, Bath, Square, Car, Wifi, Snowflake, Shield, Phone, Mail, MessageCircle, ChevronLeft, ChevronRight, Star, Calendar, ArrowLeft } from 'lucide-react';
import CalendarBookingModal from '../components/CalendarBookingModal';

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
  energyRating?: string;
}

const PropertyDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  // Energy rating color mapping
  const getEnergyRatingColor = (rating: string): { bg: string; text: string; border: string } => {
    switch (rating.toUpperCase()) {
      case 'A+':
      case 'A++':
      case 'A+++':
        return { bg: 'bg-green-600', text: 'text-white', border: 'border-green-600' };
      case 'A':
        return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-500' };
      case 'B':
        return { bg: 'bg-lime-500', text: 'text-white', border: 'border-lime-500' };
      case 'C':
        return { bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-500' };
      case 'D':
        return { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500' };
      case 'E':
        return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-500' };
      case 'F':
        return { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600' };
      case 'G':
        return { bg: 'bg-red-800', text: 'text-white', border: 'border-red-800' };
      default:
        return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch property data from public directory
        const response = await fetch('/data/properties.json');
        const properties: Property[] = await response.json();
        
        // Use the first property as static data and add energy rating
        const firstProperty = {
          ...properties[0],
          energyRating: 'A+'
        };
        setProperty(firstProperty);
        
        // Get similar properties (same city, different id)
        if (firstProperty) {
          const similar = properties
            .filter(p => p.id !== firstProperty.id && p.city === firstProperty.city)
            .slice(0, 3);
          setSimilarProperties(similar);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, []);

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const tabs = [
    { id: 'description', label: 'DESCRIZIONE', icon: Home },
    { id: 'address', label: 'INDIRIZZO', icon: MapPin },
    { id: 'details', label: 'DETTAGLI', icon: Shield },
    { id: 'features', label: 'CARATTERISTICHE', icon: Star },
    { id: 'floorplans', label: 'PLANIMETRIE', icon: Square }
  ];

  const features = [
    { icon: Wifi, label: 'Wi-Fi incluso', category: 'Connettività' },
    { icon: Car, label: 'Posto auto privato', category: 'Parcheggio' },
    { icon: Snowflake, label: 'Aria condizionata', category: 'Climatizzazione' },
    { icon: Shield, label: 'Sistema di allarme', category: 'Sicurezza' },
    { icon: Home, label: 'Completamente arredato', category: 'Arredamento' },
    { icon: Bath, label: 'Vasca idromassaggio', category: 'Bagno' }
  ];

  const interiorFeatures = [
    'Riscaldamento autonomo a gas',
    'Pavimenti in parquet',
    'Infissi in legno con doppi vetri',
    'Porte blindate',
    'Impianto elettrico a norma',
    'Predisposizione fibra ottica'
  ];

  const exteriorFeatures = [
    'Balcone con vista panoramica',
    'Giardino condominiale',
    'Posto auto coperto',
    'Cantina di proprietà',
    'Ascensore',
    'Portineria'
  ];

  const openSimilarProperty = (id: string) => {
    // For now, just reload the current page since we're using static data
    window.location.reload();
  };

  // Generate shareable URL with current search parameters
  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    }
  };

  // Navigate back with preserved search parameters
  const handleBackNavigation = () => {
    const searchParamsString = searchParams.toString();
    if (searchParamsString) {
      navigate(`/?${searchParamsString}`);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento proprietà...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proprietà non trovata</h2>
          <p className="text-gray-600 mb-6">La proprietà che stai cercando non esiste o è stata rimossa.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Torna alle Proprietà
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackNavigation}
            className="flex items-center space-x-2 text-gray-600 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alle Proprietà</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          {/* Page Header */}
          <div className="bg-white border-b p-6 rounded-t-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{property.address}</span>
                </div>
                
                {/* Property Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-primary">{property.bedrooms} Camere</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bath className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-primary">{property.bathrooms} Bagni</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-primary">{property.area} Mq</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-primary">{property.propertyType}</span>
                  </div>
                  
                  {/* Energy Rating Badge */}
                  {property.energyRating && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Classe Energetica:</span>
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg border-2 ${getEnergyRatingColor(property.energyRating).bg} ${getEnergyRatingColor(property.energyRating).text} ${getEnergyRatingColor(property.energyRating).border} font-bold text-sm`}>
                        {property.energyRating}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:text-right mt-4 lg:mt-0">
                <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">
                  {property.priceHidden ? 'Prezzo su richiesta' : `€${property.price.toLocaleString()}`}
                </div>
                <div className="text-sm text-gray-600">{property.contractType}</div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                    <span className="text-gray-700">Salva</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Condividi</span>
                    {showShareSuccess && (
                      <div className="absolute -top-8 right-0 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        Link copiato!
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-3 p-6 space-y-6">
              {/* Image Gallery */}
              <div className="relative">
                <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {property.badges.map((badge, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs font-medium uppercase tracking-wide rounded ${
                          badge === 'IN EVIDENZA' ? 'bg-accent text-white' :
                          badge === 'NOVITÀ' ? 'bg-badge-black text-white' :
                          'bg-badge-gray text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Thumbnail strip */}
                <div className="mt-4">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-accent' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabbed Content */}
              <div className="bg-white">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-accent text-accent'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Tab Content */}
                <div className="py-6">
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold text-primary mb-4">Descrizione della proprietà</h3>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          Questa splendida proprietà rappresenta una rara opportunità di vivere in una delle zone più prestigiose della città. 
                          L'immobile è stato completamente ristrutturato con materiali di alta qualità e finiture di pregio, 
                          mantenendo il fascino originale dell'architettura italiana.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          Gli spazi interni sono stati progettati per offrire il massimo comfort e funzionalità, con un perfetto equilibrio tra eleganza e praticità. 
                          Ogni ambiente è caratterizzato da ampie finestre che garantiscono una luminosità naturale eccezionale durante tutto il giorno.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          L'appartamento si distingue per i suoi soffitti alti, i pavimenti in parquet originale restaurato e le finiture di pregio 
                          che testimoniano l'attenzione ai dettagli nella ristrutturazione.
                        </p>
                        <div className="bg-accent/10 p-4 rounded-lg mt-6">
                          <h4 className="font-semibold text-accent mb-2">Punti di forza</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Posizione prestigiosa nel centro storico</li>
                            <li>Ristrutturazione completa con materiali di qualità</li>
                            <li>Ottime finiture e dettagli architettonici originali</li>
                            <li>Luminosità eccezionale e vista panoramica</li>
                            <li>Perfetto equilibrio tra tradizione e modernità</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'address' && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-6">Informazioni sull'indirizzo</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-primary mb-3">Indirizzo completo</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <p className="text-gray-700"><span className="font-medium">Via/Piazza:</span> {property.address}</p>
                              <p className="text-gray-700"><span className="font-medium">Città:</span> {property.city}</p>
                              <p className="text-gray-700"><span className="font-medium">Provincia:</span> {property.region}</p>
                              <p className="text-gray-700"><span className="font-medium">CAP:</span> 00100</p>
                              <p className="text-gray-700"><span className="font-medium">Zona:</span> Centro Storico</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-primary mb-3">Caratteristiche del quartiere</h4>
                            <p className="text-gray-700 leading-relaxed mb-4">
                              Il quartiere è rinomato per la sua atmosfera tranquilla e residenziale, 
                              pur mantenendo un facile accesso a tutti i servizi principali della città. 
                              La zona è ben servita dai trasporti pubblici e offre un ottimo mix di tradizione e modernità.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-gray-700">Zona residenziale tranquilla</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-gray-700">Ottimi collegamenti pubblici</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-gray-700">Servizi e negozi a piedi</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-gray-700">Area sicura e ben illuminata</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-primary mb-3">Servizi nelle vicinanze</h4>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">🏪 Supermercato COOP</span>
                                <span className="text-sm text-accent font-medium">200m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">🏫 Scuola Primaria</span>
                                <span className="text-sm text-accent font-medium">300m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">💊 Farmacia Comunale</span>
                                <span className="text-sm text-accent font-medium">250m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">🏥 Ospedale San Giovanni</span>
                                <span className="text-sm text-accent font-medium">800m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">🏛️ Ufficio Postale</span>
                                <span className="text-sm text-accent font-medium">180m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">🏦 Banca Intesa</span>
                                <span className="text-sm text-accent font-medium">400m</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-primary mb-3">Trasporti</h4>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-gray-700">🚌 Fermata Bus (Linea 64, 70)</span>
                                <span className="text-sm text-blue-600 font-medium">150m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700">🚇 Metro Linea A (Spagna)</span>
                                <span className="text-sm text-green-600 font-medium">500m</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <span className="text-gray-700">🚂 Stazione Termini</span>
                                <span className="text-sm text-orange-600 font-medium">1.2km</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <span className="text-gray-700">✈️ Aeroporto Fiumicino</span>
                                <span className="text-sm text-purple-600 font-medium">25km</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'details' && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-6">Dettagli tecnici e specifiche</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-4">Informazioni generali</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Codice Immobile:</span>
                                <span className="font-medium text-primary">#{property.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tipologia:</span>
                                <span className="font-medium text-primary">{property.propertyType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Contratto:</span>
                                <span className="font-medium text-primary">{property.contractType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Superficie:</span>
                                <span className="font-medium text-primary">{property.area} mq</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Camere da letto:</span>
                                <span className="font-medium text-primary">{property.bedrooms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bagni:</span>
                                <span className="font-medium text-primary">{property.bathrooms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Piano:</span>
                                <span className="font-medium text-primary">3° di 5</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ascensore:</span>
                                <span className="font-medium text-green-600">Sì</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-4">Classificazione energetica</h4>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-4">
                                <span className="text-gray-600">Classe energetica:</span>
                                {property.energyRating && (
                                  <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${getEnergyRatingColor(property.energyRating).bg} ${getEnergyRatingColor(property.energyRating).text} ${getEnergyRatingColor(property.energyRating).border} font-bold text-lg`}>
                                    {property.energyRating}
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">EPgl,nren:</span>
                                <span className="font-medium text-primary">15,50 kWh/m²anno</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Emissioni CO2:</span>
                                <span className="font-medium text-primary">3,2 kg/m²anno</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">Certificato APE valido fino al 15/03/2034</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-4">Informazioni catastali</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Categoria:</span>
                                <span className="font-medium text-primary">A/2</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Classe:</span>
                                <span className="font-medium text-primary">3</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Consistenza:</span>
                                <span className="font-medium text-primary">5,5 vani</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rendita:</span>
                                <span className="font-medium text-primary">€ 890,00</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Superficie catastale:</span>
                                <span className="font-medium text-primary">95 mq</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-4">Spese condominiali</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Spese ordinarie:</span>
                                <span className="font-medium text-primary">€ 120/mese</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Riscaldamento:</span>
                                <span className="font-medium text-primary">€ 30/mese</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Totale mensile:</span>
                                <span className="font-bold text-accent">€ 150/mese</span>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">Include:</p>
                                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                  <li>• Pulizie parti comuni</li>
                                  <li>• Manutenzione ascensore</li>
                                  <li>• Illuminazione scale</li>
                                  <li>• Amministrazione</li>
                                  <li>• Portineria (part-time)</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-primary mb-4">Anno e ristrutturazione</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Anno di costruzione:</span>
                                <span className="font-medium text-primary">1960</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Ultima ristrutturazione:</span>
                                <span className="font-medium text-primary">2022</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stato di manutenzione:</span>
                                <span className="font-medium text-green-600">Eccellente</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'features' && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-6">Caratteristiche e dotazioni</h3>
                      <div className="space-y-8">
                        {/* Main Features Grid */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Servizi principali</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((feature, index) => {
                              const Icon = feature.icon;
                              return (
                                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <Icon className="w-6 h-6 text-accent" />
                                  <div>
                                    <span className="text-gray-900 font-medium">{feature.label}</span>
                                    <p className="text-sm text-gray-600">{feature.category}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Interior Features */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Caratteristiche interne</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {interiorFeatures.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Exterior Features */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Caratteristiche esterne</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exteriorFeatures.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Security Features */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Sicurezza e controllo accessi</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <Shield className="w-5 h-5 text-red-600" />
                              <span className="text-gray-700">Sistema di allarme perimetrale</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <Shield className="w-5 h-5 text-red-600" />
                              <span className="text-gray-700">Videocitofono con telecamera</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <Shield className="w-5 h-5 text-red-600" />
                              <span className="text-gray-700">Porta blindata classe 3</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <Shield className="w-5 h-5 text-red-600" />
                              <span className="text-gray-700">Serrature di sicurezza</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'floorplans' && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-6">Planimetrie e layout</h3>
                      <div className="space-y-8">
                        {/* Main Floor Plan */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Planimetria principale</h4>
                          <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <div className="bg-white rounded-lg p-12 shadow-inner">
                              <Square className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-2">Planimetria dell'appartamento</p>
                              <p className="text-sm text-gray-500">Superficie: {property.area} mq</p>
                              <button className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                                Visualizza planimetria completa
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Room Distribution */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Distribuzione degli spazi</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 className="font-medium text-blue-900 mb-2">Zona giorno</h5>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Soggiorno (25 mq)</li>
                                <li>• Cucina abitabile (12 mq)</li>
                                <li>• Balcone (8 mq)</li>
                              </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h5 className="font-medium text-green-900 mb-2">Zona notte</h5>
                              <ul className="text-sm text-green-700 space-y-1">
                                <li>• Camera matrimoniale (16 mq)</li>
                                <li>• Camera singola (10 mq)</li>
                                <li>• Bagno principale (6 mq)</li>
                              </ul>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <h5 className="font-medium text-orange-900 mb-2">Servizi</h5>
                              <ul className="text-sm text-orange-700 space-y-1">
                                <li>• Ingresso (4 mq)</li>
                                <li>• Ripostiglio (3 mq)</li>
                                <li>• Cantina (5 mq)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        {/* 3D Visualization */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Vista 3D e virtual tour</h4>
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center">
                            <div className="bg-white rounded-lg p-8 shadow-inner">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">3D</span>
                              </div>
                              <p className="text-gray-700 mb-4">Esplora l'appartamento con il virtual tour interattivo</p>
                              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                  Avvia virtual tour
                                </button>
                                <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                                  Scarica planimetrie PDF
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Technical Measurements */}
                        <div>
                          <h4 className="font-semibold text-primary mb-4">Misure tecniche</h4>
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold text-accent">{property.area}</div>
                                <div className="text-sm text-gray-600">mq totali</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-accent">2.8</div>
                                <div className="text-sm text-gray-600">Altezza soffitti (m)</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-accent">8</div>
                                <div className="text-sm text-gray-600">Balcone (mq)</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-accent">5</div>
                                <div className="text-sm text-gray-600">Cantina (mq)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-primary mb-6">Proprietà simili</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {similarProperties.map((similarProperty) => (
                      <button
                        key={similarProperty.id}
                        onClick={() => openSimilarProperty(similarProperty.id)}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow text-left"
                      >
                        <div className="relative h-32">
                          <img
                            src={similarProperty.images[0]}
                            alt={similarProperty.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-accent text-white px-2 py-1 text-xs rounded">
                              €{similarProperty.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-primary text-sm mb-1 line-clamp-1">
                            {similarProperty.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">{similarProperty.address}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{similarProperty.bedrooms} cam</span>
                            <span>{similarProperty.bathrooms} bagni</span>
                            <span>{similarProperty.area} mq</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1 bg-gray-50 p-6">
              <div className="sticky top-6 space-y-6">
                {/* Contact Agent */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary mb-4">Contatta l'agente</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">AG</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary">Marco Rossi</p>
                        <p className="text-sm text-gray-600">Agente Immobiliare</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center space-x-2 bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                        <Phone className="w-4 h-4" />
                        <span>Chiama Ora</span>
                      </button>
                      <button className="w-full flex items-center justify-center space-x-2 border border-accent text-accent py-3 rounded-lg hover:bg-accent hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                        <span>Invia Email</span>
                      </button>
                      <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Schedule Visit */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary mb-4">Prenota una visita</h3>
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Prenota Visita</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary mb-4">Informazioni rapide</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Proprietà:</span>
                      <span className="font-semibold">{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-semibold">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Città:</span>
                      <span className="font-semibold">{property.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regione:</span>
                      <span className="font-semibold">{property.region}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Booking Modal */}
      <CalendarBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyTitle={property?.title}
        propertyId={property?.id}
      />
    </div>
  );
};

export { PropertyDetailPage };