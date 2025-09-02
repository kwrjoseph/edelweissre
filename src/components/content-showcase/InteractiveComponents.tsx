import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Home, Bed, Bath, Car, Wifi, Calendar, Clock, Check, X } from 'lucide-react';

const InteractiveComponents: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('faq1');
  const [activeTab, setActiveTab] = useState('descrizione');
  const [toggles, setToggles] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    weeklyReport: false
  });
  const [sliders, setSliders] = useState({
    priceRange: [200000, 800000],
    area: 120,
    bedrooms: 3
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [progressStep, setProgressStep] = useState(2);

  const accordionItems = [
    {
      id: 'faq1',
      title: 'Come funziona il processo di acquisto?',
      content: 'Il processo di acquisto è guidato dai nostri esperti in ogni fase: dalla ricerca iniziale fino alla firma del contratto. Offriamo supporto completo per valutazioni, trattative, pratiche legali e finanziarie.'
    },
    {
      id: 'faq2', 
      title: 'Quali sono i costi aggiuntivi da considerare?',
      content: 'Oltre al prezzo di acquisto, considera le imposte di registro (2-9% a seconda del tipo), le spese notarili (1-2%), eventuali spese di agenzia, e i costi per pratiche burocratiche. Ti forniamo sempre un quadro completo dei costi.'
    },
    {
      id: 'faq3',
      title: 'Offrite servizi di valutazione gratuita?',
      content: 'Sì, offriamo valutazioni gratuite e senza impegno. I nostri esperti utilizzano metodologie professionali e dati di mercato aggiornati per fornire stime accurate del valore di mercato.'
    },
    {
      id: 'faq4',
      title: 'Posso visitare le proprietà nel weekend?',
      content: 'Assolutamente sì. Organizziamo visite anche nei weekend e giorni festivi su appuntamento. La flessibilità oraria è importante per noi quanto per i nostri clienti.'
    }
  ];

  const tabContent = {
    descrizione: {
      title: 'Descrizione Completa',
      content: 'Questa elegante proprietà rappresenta il perfetto equilibrio tra comfort moderno e charme tradizionale. Situata in una posizione privilegiata, offre spazi luminosi e ben distribuiti, ideali per una famiglia che cerca qualità e prestigio.'
    },
    dettagli: {
      title: 'Dettagli Tecnici',
      content: 'Anno di costruzione: 2018 | Classe energetica: A+ | Riscaldamento: Autonomo a metano | Infissi: PVC doppio vetro | Pavimenti: Parquet rovere e ceramica di pregio | Impianto di climatizzazione in tutti gli ambienti.'
    },
    planimetrie: {
      title: 'Planimetrie',
      content: 'Visualizza le planimetrie dettagliate con la distribuzione degli spazi, le dimensioni di ogni ambiente e la disposizione degli impianti. Disponibili anche rendering 3D su richiesta.'
    },
    mappa: {
      title: 'Posizione',
      content: 'Ubicazione strategica con facile accesso a servizi essenziali: scuole (300m), supermercati (200m), trasporti pubblici (150m), parco (400m). Ben collegata al centro città e alle principali arterie stradali.'
    }
  };

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const steps = ['Informazioni', 'Preferenze', 'Contatti', 'Conferma'];

  const toggleSwitch = (key: string) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof toggles]
    }));
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `€${(price / 1000000).toFixed(1)}M`;
    }
    return `€${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-16">
      {/* Accordion Sections */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Sezioni a Fisarmonica (Accordion)</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Domande Frequenti (FAQ)
            </h3>
            <p className="text-gray-600">
              Trova rapidamente le risposte alle domande più comuni sui nostri servizi immobiliari.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {accordionItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-primary">{item.title}</span>
                  {activeAccordion === item.id ? (
                    <ChevronUp className="w-5 h-5 text-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {activeAccordion === item.id && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Contenuto a Schede (Tabs)</h3>
        </div>
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8 overflow-x-auto">
                {Object.entries(tabContent).map(([key, tab]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === key
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-32">
              <h4 className="text-xl font-semibold text-primary mb-4">
                {tabContent[activeTab as keyof typeof tabContent].title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {tabContent[activeTab as keyof typeof tabContent].content}
              </p>
              
              {activeTab === 'dettagli' && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">Classe A+</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">Fibra ottica</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">Posto auto</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">Idromassaggio</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Indicatori di Progresso</h3>
        </div>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Progresso Modulo Multi-Step
              </h3>
              <p className="text-gray-600">
                Visualizza chiaramente a che punto sei nel processo di registrazione o richiesta.
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      index < progressStep 
                        ? 'bg-accent text-white' 
                        : index === progressStep 
                        ? 'bg-accent text-white ring-4 ring-accent/20' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < progressStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      index <= progressStep ? 'text-accent' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-500 -z-10" 
                  style={{ width: `${(progressStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Progress Controls */}
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setProgressStep(Math.max(0, progressStep - 1))}
                disabled={progressStep === 0}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Indietro
              </button>
              <button 
                onClick={() => setProgressStep(Math.min(steps.length - 1, progressStep + 1))}
                disabled={progressStep === steps.length - 1}
                className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Avanti
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Switches */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Interruttori Toggle</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Preferenze di Notifica
              </h3>
              <p className="text-gray-600">
                Personalizza come e quando vuoi ricevere aggiornamenti sulle proprietà e sul mercato.
              </p>
            </div>
            
            <div className="space-y-6">
              {Object.entries(toggles).map(([key, value]) => {
                const labels = {
                  emailNotifications: 'Notifiche via Email',
                  smsNotifications: 'Notifiche SMS',
                  marketingEmails: 'Email di Marketing',
                  weeklyReport: 'Report Settimanale'
                };
                
                return (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-semibold text-primary">
                        {labels[key as keyof typeof labels]}
                      </label>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Ricevi notifiche immediate via email per nuove proprietà'}
                        {key === 'smsNotifications' && 'Ricevi SMS per aggiornamenti urgenti'}
                        {key === 'marketingEmails' && 'Ricevi offerte speciali e promozioni'}
                        {key === 'weeklyReport' && 'Ricevi un riepilogo settimanale del mercato'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSwitch(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                        value ? 'bg-accent' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Cursori (Sliders)</h3>
        </div>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Filtri di Ricerca Interattivi
              </h3>
              <p className="text-gray-600">
                Utilizza i cursori per definire con precisione i tuoi criteri di ricerca.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Price Range Slider */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Fascia di Prezzo: {formatPrice(sliders.priceRange[0])} - {formatPrice(sliders.priceRange[1])}
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Prezzo Minimo</label>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="50000"
                      value={sliders.priceRange[0]}
                      onChange={(e) => setSliders({
                        ...sliders,
                        priceRange: [parseInt(e.target.value), sliders.priceRange[1]]
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Prezzo Massimo</label>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={sliders.priceRange[1]}
                      onChange={(e) => setSliders({
                        ...sliders,
                        priceRange: [sliders.priceRange[0], parseInt(e.target.value)]
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-accent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Area Slider */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Superficie Minima: {sliders.area} mq
                </label>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={sliders.area}
                  onChange={(e) => setSliders({...sliders, area: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-accent"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>30 mq</span>
                  <span>500 mq</span>
                </div>
              </div>
              
              {/* Bedrooms Slider */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Numero di Camere: {sliders.bedrooms}+
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={sliders.bedrooms}
                  onChange={(e) => setSliders({...sliders, bedrooms: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-accent"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {[1,2,3,4,5,6].map(num => (
                    <span key={num} className={sliders.bedrooms === num ? 'text-accent font-bold' : ''}>
                      {num}+
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Selettori Data e Ora</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Prenotazione Appuntamento
              </h3>
              <p className="text-gray-600">
                Seleziona la data e l'orario che preferisci per la visita alla proprietà.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seleziona una Data</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {/* Time Slot Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Seleziona un Orario</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-md border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                        selectedTime === time
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 hover:border-accent hover:bg-accent/5'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{time}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Summary */}
              {selectedDate && selectedTime && (
                <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Appuntamento Selezionato</p>
                      <p className="text-gray-600">
                        {new Date(selectedDate).toLocaleDateString('it-IT', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} alle ore {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InteractiveComponents };