import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import all showcase components
import { HeroVariations } from '../components/content-showcase/HeroVariations';
import { ContentComponents } from '../components/content-showcase/ContentComponents';
import { SearchInterfaces } from '../components/content-showcase/SearchInterfaces';
import SearchModule from '../components/SearchModule';
import { FormLayouts } from '../components/content-showcase/FormLayouts';
import { InteractiveComponents } from '../components/content-showcase/InteractiveComponents';
import { SubmissionStats } from '../components/content-showcase/SubmissionStats';

const ContentFormsShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Torna alle Proprietà</span>
            </button>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Libreria di Componenti: Contenuti & Moduli
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Una collezione completa di componenti di contenuto, interfacce di ricerca e layout di moduli 
              per la piattaforma immobiliare di lusso. Ogni componente è progettato per offrire 
              un'esperienza utente elegante e funzionale.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* Real-time Submission Statistics */}
        <SubmissionStats />
        {/* Section 1: Hero Variations */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Variazioni della Hero Section
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Diverse variazioni di sezioni hero per diverse tipologie di pagine e obiettivi di conversione.
            </p>
          </div>
          <HeroVariations />
        </section>

        {/* Section 2: Content Components */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Componenti di Contenuto
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Blocchi di contenuto riutilizzabili per presentare informazioni, statistiche e testimonianze.
            </p>
          </div>
          <ContentComponents />
        </section>

        {/* Section 3: Property Search Interfaces */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Interfacce di Ricerca Immobili
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistemi di ricerca avanzati e semplificati per aiutare i clienti a trovare la proprietà perfetta.
            </p>
          </div>
          <SearchInterfaces />
        </section>

        {/* Section 3.5: New Search Module */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Modulo di Ricerca Orizzontale
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Barra di ricerca compatta con 5 campi specifici, ottimizzata per layout desktop orizzontale e mobile responsive.
            </p>
          </div>
          <SearchModule className="max-w-full" onSearch={(data) => console.log('Search data:', data)} />
        </section>

        {/* Section 4: Form Layouts */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Variazioni dei Moduli di Contatto
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Diverse tipologie di moduli per raccogliere informazioni dai clienti e generare lead qualificati.
            </p>
          </div>
          <FormLayouts />
        </section>

        {/* Section 5: Interactive Components */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Componenti Interattivi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Elementi interattivi per migliorare l'esperienza utente e la funzionalità dei moduli.
            </p>
          </div>
          <InteractiveComponents />
        </section>
      </div>

      {/* Footer Notes */}
      <div className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Note di Implementazione
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Componenti Modulari</h4>
                <p className="text-gray-600 text-sm">
                  Ogni componente è progettato per essere riutilizzabile e facilmente personalizzabile.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Design Responsivo</h4>
                <p className="text-gray-600 text-sm">
                  Tutti i layout si adattano automaticamente a schermi di diverse dimensioni.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Accessibilità</h4>
                <p className="text-gray-600 text-sm">
                  Implementazione conforme alle linee guida WCAG 2.1 AA per l'accessibilità.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentFormsShowcase };