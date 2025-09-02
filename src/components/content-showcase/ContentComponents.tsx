import React from 'react';
import { Star, Users, Home, Award, Quote, ArrowRight, TrendingUp, Shield, Phone } from 'lucide-react';

const ContentComponents: React.FC = () => {
  const testimonials = [
    {
      name: "Marco Rossi",
      role: "Acquirente Villa, Firenze",
      content: "Servizio eccellente e professionalità incredibile. Hanno trovato esattamente quello che cercavamo per la nostra famiglia.",
      rating: 5,
      image: "/images/property1-1.jpg"
    },
    {
      name: "Elena Bianchi",
      role: "Investitore, Milano",
      content: "Competenza e trasparenza in ogni fase dell'acquisto. Consigliano davvero solo le migliori opportunità di investimento.",
      rating: 5,
      image: "/images/property2-1.jpg"
    },
    {
      name: "Giuseppe Verdi",
      role: "Proprietario Attico, Roma",
      content: "Grazie al loro supporto sono riuscito a vendere il mio attico al prezzo migliore del mercato in tempi record.",
      rating: 5,
      image: "/images/property3-1.JPEG"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Sezione Statistiche</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              I Nostri Risultati
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Numeri che testimoniano la nostra esperienza e il successo dei nostri clienti nel mercato immobiliare di lusso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-gray-600 font-semibold">Proprietà Vendute</div>
              <div className="text-sm text-gray-500 mt-1">Negli ultimi 5 anni</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-600 font-semibold">Anni di Esperienza</div>
              <div className="text-sm text-gray-500 mt-1">Nel mercato di lusso</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600 font-semibold">Clienti Soddisfatti</div>
              <div className="text-sm text-gray-500 mt-1">Valutazione media</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Sezione Testimonianze</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cosa Dicono i Nostri Clienti
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Le testimonianze autentiche di chi ha scelto la nostra esperienza per trovare la casa dei propri sogni.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Contenuti in Evidenza</h3>
        </div>
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Le Nostre Proposte del Mese
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proprietà selezionate con cura dal nostro team per offrire le migliori opportunità di investimento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent mr-2" />
                <span className="bg-accent text-white px-3 py-1 text-sm font-bold uppercase rounded">In Evidenza</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Villa Esclusiva con Vista Mare</h3>
              <p className="text-gray-600 mb-6">
                Proprietà unica sulla costa toscana con piscina privata, giardino mediterraneo e accesso diretto alla spiaggia. 
                Un'opportunità rara nel mercato del lusso.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-accent">€ 2.850.000</div>
                <button className="bg-accent text-white px-6 py-3 rounded-md hover:bg-accent/90 transition-colors flex items-center space-x-2">
                  <span>Scopri di Più</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-primary mr-2" />
                <span className="bg-primary text-white px-3 py-1 text-sm font-bold uppercase rounded">Investimento</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Attico Panoramico Centro Milano</h3>
              <p className="text-gray-600 mb-6">
                Prestigioso attico ristrutturato nel cuore di Milano con terrazza panoramica. 
                Rendimento garantito e valore in costante crescita.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">€ 1.650.000</div>
                <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2">
                  <span>Maggiori Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Blocks Variations */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Blocchi di Testo e Layout</h3>
        </div>
        <div className="p-8 space-y-12">
          {/* Image + Text Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Esperienza e Professionalità
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Da oltre 25 anni siamo leader nel mercato immobiliare di lusso, offrendo ai nostri clienti 
                un servizio personalizzato e risultati eccellenti. La nostra esperienza si traduce in 
                consulenza di alta qualità e transazioni sempre trasparenti.
              </p>
              <button className="bg-accent text-white px-6 py-3 rounded-md hover:bg-accent/90 transition-colors">
                La Nostra Storia
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="/images/property4-1.jpg" 
                alt="Esperienza professionale"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
          
          {/* Image + Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/images/property5-1.jpg" 
                alt="Servizi personalizzati"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Servizi Personalizzati
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ogni cliente è unico e merita un approccio su misura. Offriamo servizi completi che spaziano 
                dalla ricerca della proprietà ideale fino alla gestione post-vendita, sempre con la massima 
                attenzione ai dettagli.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Consulenza personalizzata
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Valutazione professionale
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Supporto legale completo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Blocks */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Blocchi Call-to-Action</h3>
        </div>
        <div className="p-8 space-y-8">
          {/* Primary CTA */}
          <div className="bg-gradient-to-r from-accent to-accent/80 text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sei Pronto a Trovare la Tua Casa?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              I nostri esperti sono qui per guidarti nella ricerca della proprietà perfetta. 
              Prenota una consulenza gratuita e inizia il tuo percorso verso la casa dei tuoi sogni.
            </p>
            <button className="bg-white text-accent px-8 py-4 text-lg font-bold uppercase rounded-md hover:bg-gray-100 transition-all duration-300">
              Contattaci Ora
            </button>
          </div>
          
          {/* Secondary CTA */}
          <div className="border-2 border-primary p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Vuoi Vendere la Tua Proprietà?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ottieni una valutazione gratuita e professionale della tua proprietà. I nostri esperti ti aiuteranno 
              a ottenere il massimo valore dal tuo investimento immobiliare.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Chiama Ora</span>
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors">
                Richiedi Valutazione
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContentComponents };