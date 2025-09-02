import React, { useState } from 'react';
import { Search, Play, ArrowRight, MapPin, Home, Calendar } from 'lucide-react';

const HeroVariations: React.FC = () => {
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    priceRange: ''
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission - remove console.log for production
    // In a real app, this would trigger a search with the form data
    alert(`Ricerca inviata per: ${searchForm.location || 'Tutte le location'}, ${searchForm.propertyType || 'Tutte le tipologie'}`);
  };

  return (
    <div className="space-y-16">
      {/* Classic Hero */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Hero Classica con Immagine di Sfondo</h3>
        </div>
        <div className="relative h-96 bg-gradient-to-r from-black/60 to-black/30">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: 'url(/images/property1-1.jpg)',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Scopri la Tua Prossima Proprietà di Lusso in Italia
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Esplora le migliori proprietà immobiliari nelle location più esclusive d'Italia
              </p>
              <button className="bg-accent text-white px-8 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 shadow-lg">
                Vedi le Proprietà
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Hero */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Hero Divisa con Modulo di Ricerca</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-96">
          <div className="p-8 lg:p-12 flex items-center">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-primary mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Trova la Casa dei Tuoi Sogni
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Utilizza la nostra ricerca avanzata per scoprire proprietà esclusive che corrispondono perfettamente alle tue esigenze.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Località</label>
                  <input 
                    type="text" 
                    placeholder="Es. Milano, Roma, Firenze..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm({...searchForm, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipologia</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                      value={searchForm.propertyType}
                      onChange={(e) => setSearchForm({...searchForm, propertyType: e.target.value})}
                    >
                      <option value="">Tutte le tipologie</option>
                      <option value="appartamento">Appartamento</option>
                      <option value="villa">Villa</option>
                      <option value="attico">Attico</option>
                      <option value="chalet">Chalet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fascia di Prezzo</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                      value={searchForm.priceRange}
                      onChange={(e) => setSearchForm({...searchForm, priceRange: e.target.value})}
                    >
                      <option value="">Qualsiasi prezzo</option>
                      <option value="0-500000">Fino a 500.000€</option>
                      <option value="500000-1000000">500.000€ - 1.000.000€</option>
                      <option value="1000000+">Oltre 1.000.000€</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Cerca Proprietà</span>
                </button>
              </form>
            </div>
          </div>
          <div className="bg-gray-200 bg-cover bg-center" style={{ backgroundImage: 'url(/images/property2-1.jpg)' }}></div>
        </div>
      </div>

      {/* Video Hero */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Hero con Video di Sfondo</h3>
        </div>
        <div className="relative h-96 bg-gradient-to-r from-black/70 to-black/40">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: 'url(/images/video-hero-bg.jpg)',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          {/* Video Play Indicator */}
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-2 py-1 text-xs rounded flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>VIDEO</span>
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
              <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="relative h-full flex items-end">
            <div className="p-8 w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
                <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Vivi lo Stile Italiano
                </h2>
                <p className="text-white/90 mb-4">
                  Scopri il lusso autentico nelle nostre proprietà esclusive
                </p>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Cerca per località..."
                    className="flex-1 p-3 rounded-md border-none outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="bg-accent text-white px-6 py-3 rounded-md hover:bg-accent/90 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Hero */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Hero Minimalista</h3>
        </div>
        <div className="relative h-96 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center max-w-4xl px-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-primary mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Eleganza. Prestigio. Esclusività.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              L'eccellenza immobiliare italiana incontra il design contemporaneo in ogni nostra proprietà selezionata.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-primary text-white px-8 py-4 text-lg font-bold uppercase rounded-md hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Esplora Proprietà</span>
              </button>
              <button className="border-2 border-accent text-accent px-8 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent hover:text-white transition-all duration-300 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Prenota Consulenza</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeroVariations };