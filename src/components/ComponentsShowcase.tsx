import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { EdelweissRegionalSections } from './showcase/EdelweissRegionalSections';
import { HeroPropertySlider } from './showcase/HeroPropertySlider';
import { ClassicCarousel } from './showcase/ClassicCarousel';
import { FeaturedPropertyHero } from './showcase/FeaturedPropertyHero';
import { GridLayouts } from './showcase/GridLayouts';
import { MagazineLayout } from './showcase/MagazineLayout';
import { ListView } from './showcase/ListView';
import { SplitScreenDisplay } from './showcase/SplitScreenDisplay';
import { SliderWithThumbnails } from './showcase/SliderWithThumbnails';
import { HoverEffectsGrid } from './showcase/HoverEffectsGrid';

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
}

const sections = [
  { id: 'edelweiss', title: 'Sezioni Regionali Stile Edelweiss', description: 'Raggruppa le proprietà per area geografica con design elegante' },
  { id: 'hero-slider', title: 'Hero Property Slider', description: 'Slider principale con proprietà di grandi dimensioni' },
  { id: 'classic-carousel', title: 'Carousel Classico', description: 'Scorrimento orizzontale con navigazione intuitive' },
  { id: 'featured-hero', title: 'Hero Proprietà in Evidenza', description: 'Layout asimmetrico con proprietà principale e laterali' },
  { id: 'grid-layouts', title: 'Layout a Griglia', description: 'Variazioni di griglie: 2x2, 3x3, Masonry, Pinterest' },
  { id: 'magazine', title: 'Stile Magazine', description: 'Layout asimmetrico con dimensioni miste delle card' },
  { id: 'list-view', title: 'Vista Elenco', description: 'Disposizione verticale ottimizzata per mobile' },
  { id: 'split-screen', title: 'Schermo Diviso', description: 'Galleria immagini e dettagli affiancati' },
  { id: 'thumbnail-slider', title: 'Slider con Miniature', description: 'Navigazione con anteprime delle immagini' },
  { id: 'hover-effects', title: 'Effetti Hover Avanzati', description: 'Card interattive con animazioni sofisticate' },
];

export function ComponentsShowcase() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetch('/data/properties.json');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e3ae61] mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento componenti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e3ae61] to-[#d4a052] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            Componenti Proprietà
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Una libreria completa di moduli e layout creativi per la presentazione delle proprietà
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{sections.length}</div>
              <div className="text-white/80">Componenti</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">{properties.length}</div>
              <div className="text-white/80">Proprietà</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-white/80">Responsive</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-white/80">Possibilità</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-3 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-[#e3ae61] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#e3ae61] hover:bg-gray-100'
                }`}
              >
                {section.title}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Component Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Edelweiss Regional Sections */}
        <section id="edelweiss" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Sezioni Regionali Stile Edelweiss</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Questo layout raggruppa le proprietà per area geografica, ispirato al design Edelweiss con sezioni ben definite per ogni regione.
            </p>
          </div>
          <EdelweissRegionalSections properties={properties} />
        </section>

        {/* Hero Property Slider */}
        <section id="hero-slider" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Hero Property Slider</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Slider principale con proprietà di grandi dimensioni, perfetto per homepage o sezioni di evidenza.
            </p>
          </div>
          <HeroPropertySlider properties={properties.slice(0, 6)} />
        </section>

        {/* Classic Carousel */}
        <section id="classic-carousel" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Carousel Classico</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scorrimento orizzontale con frecce di navigazione e supporto touch per dispositivi mobili.
            </p>
          </div>
          <ClassicCarousel properties={properties} />
        </section>

        {/* Featured Property Hero */}
        <section id="featured-hero" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Hero Proprietà in Evidenza</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Layout asimmetrico con una proprietà principale di grandi dimensioni e proprietà secondarie laterali.
            </p>
          </div>
          <FeaturedPropertyHero properties={properties.slice(0, 4)} />
        </section>

        {/* Grid Layouts */}
        <section id="grid-layouts" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Layout a Griglia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diverse variazioni di griglie: 2x2, 3x3, stile Masonry e Pinterest per ogni esigenza di design.
            </p>
          </div>
          <GridLayouts properties={properties} />
        </section>

        {/* Magazine Layout */}
        <section id="magazine" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Layout Stile Magazine</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Disposizione asimmetrica con dimensioni miste delle card, perfetta per creare gerarchie visive interessanti.
            </p>
          </div>
          <MagazineLayout properties={properties.slice(0, 8)} />
        </section>

        {/* List View */}
        <section id="list-view" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Vista Elenco</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Layout verticale ottimizzato per mobile con immagini a sinistra e dettagli a destra.
            </p>
          </div>
          <ListView properties={properties.slice(0, 6)} />
        </section>

        {/* Split Screen */}
        <section id="split-screen" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Schermo Diviso</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Metà schermo per galleria immagini e metà per dettagli, ideale per showcase dettagliati delle proprietà.
            </p>
          </div>
          <SplitScreenDisplay properties={properties.slice(0, 5)} />
        </section>

        {/* Slider with Thumbnails */}
        <section id="thumbnail-slider" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Slider con Miniature</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Slider principale con navigazione tramite miniature, perfetto per gallerie dettagliate.
            </p>
          </div>
          <SliderWithThumbnails properties={properties.slice(0, 6)} />
        </section>

        {/* Hover Effects Grid */}
        <section id="hover-effects" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Effetti Hover Avanzati</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Card con animazioni sofisticate e stati interattivi per un'esperienza premium.
            </p>
          </div>
          <HoverEffectsGrid properties={properties.slice(0, 9)} />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4 font-serif">Libreria Componenti Premium</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tutti i componenti sono completamente responsive, accessibili e ottimizzati per le prestazioni. 
            Utilizza questi layout per creare esperienze utente coinvolgenti nel tuo sito immobiliare.
          </p>
        </div>
      </footer>
    </div>
  );
}