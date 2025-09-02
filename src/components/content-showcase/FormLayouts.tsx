import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Calendar, User, Home, Euro, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import SearchableMultiSelect from '../SearchableMultiSelect';
import CalendarBookingModal from '../CalendarBookingModal';
import {
  submitContactForm,
  submitPropertyInquiry, 
  submitViewingRequest,
  submitNewsletter,
  submitValuation,
  submitAgentContact,
  FormSubmissionResult
} from '../../utils/formHandler';

const FormLayouts: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [propertyInquiry, setPropertyInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    propertyRef: 'VZ0123',
    message: ''
  });

  const [viewingRequest, setViewingRequest] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: [] as string[],
    message: ''
  });

  const [newsletter, setNewsletter] = useState({
    email: '',
    preferences: {
      luxury: false,
      investment: false,
      commercial: false
    }
  });

  const [valuation, setValuation] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: [] as string[],
    area: '',
    message: ''
  });

  const [agentContact, setAgentContact] = useState({
    name: '',
    email: '',
    phone: '',
    contactMethod: 'email',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Property type options for valuation form
  const valuationPropertyTypeOptions = [
    { value: 'appartamento', label: 'Appartamento' },
    { value: 'villa', label: 'Villa' },
    { value: 'attico', label: 'Attico' },
    { value: 'casa-schiera', label: 'Casa a Schiera' },
    { value: 'loft', label: 'Loft' },
    { value: 'altro', label: 'Altro' }
  ];
  const timeSlotOptions = [
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' }
  ];

  const handleSubmit = async (formType: string, formData: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setValidationErrors({});
    
    try {
      let result: FormSubmissionResult;
      
      switch (formType) {
        case 'contact':
          result = await submitContactForm(formData);
          break;
        case 'property-inquiry':
          result = await submitPropertyInquiry(formData);
          break;
        case 'viewing-request':
          result = await submitViewingRequest(formData);
          break;
        case 'newsletter':
          result = await submitNewsletter(formData);
          break;
        case 'valuation':
          result = await submitValuation(formData);
          break;
        case 'agent-contact':
          result = await submitAgentContact(formData);
          break;
        default:
          result = { success: false, message: 'Tipo di modulo non riconosciuto' };
      }
      
      setSubmitStatus(result.success ? 'success' : 'error');
      setSubmitMessage(result.message);
      
      // Reset form on success
      if (result.success) {
        // Reset forms after successful submission
        setTimeout(() => {
          if (formType === 'contact') {
            setContactForm({ name: '', email: '', message: '' });
          } else if (formType === 'property-inquiry') {
            setPropertyInquiry({ name: '', email: '', phone: '', propertyRef: 'VZ0123', message: '' });
          } else if (formType === 'viewing-request') {
            setViewingRequest({ name: '', email: '', phone: '', date: '', time: [], message: '' });
          } else if (formType === 'newsletter') {
            setNewsletter({ email: '', preferences: { luxury: false, investment: false, commercial: false } });
          } else if (formType === 'valuation') {
            setValuation({ name: '', email: '', phone: '', address: '', propertyType: [], area: '', message: '' });
          } else if (formType === 'agent-contact') {
            setAgentContact({ name: '', email: '', phone: '', contactMethod: 'email', message: '' });
          }
        }, 3000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Errore di sistema. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (formType: string, fieldName: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          errors[`${formType}_${fieldName}`] = 'Il nome è obbligatorio';
        } else {
          delete errors[`${formType}_${fieldName}`];
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors[`${formType}_${fieldName}`] = 'L\'email è obbligatoria';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[`${formType}_${fieldName}`] = 'Inserisci un indirizzo email valido';
        } else {
          delete errors[`${formType}_${fieldName}`];
        }
        break;
      case 'phone':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.replace(/\s/g, ''))) {
          errors[`${formType}_${fieldName}`] = 'Inserisci un numero di telefono valido';
        } else {
          delete errors[`${formType}_${fieldName}`];
        }
        break;
      case 'message':
        if (!value.trim()) {
          errors[`${formType}_${fieldName}`] = 'Il messaggio è obbligatorio';
        } else {
          delete errors[`${formType}_${fieldName}`];
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  const getFieldError = (formType: string, fieldName: string) => {
    return validationErrors[`${formType}_${fieldName}`];
  };

  const FormMessage = ({ status, message }: { status: 'success' | 'error'; message: string }) => {
    if (status === 'success') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-green-700">{message}</span>
        </div>
      );
    }
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <span className="text-red-700">{message}</span>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      {/* Basic Contact Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Modulo di Contatto Base</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Contattaci
              </h3>
              <p className="text-gray-600">
                Hai domande o vuoi maggiori informazioni? Scrivici e ti risponderemo al più presto.
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('contact', contactForm);
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome e Cognome *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Inserisci il tuo nome completo"
                  className={`w-full p-3 border rounded-md focus:ring-1 outline-none transition-colors ${
                    getFieldError('contact', 'name') 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-accent focus:ring-accent'
                  }`}
                  value={contactForm.name}
                  onChange={(e) => {
                    setContactForm({...contactForm, name: e.target.value});
                    validateField('contact', 'name', e.target.value);
                  }}
                />
                {getFieldError('contact', 'name') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('contact', 'name')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="la.tua.email@esempio.com"
                  className={`w-full p-3 border rounded-md focus:ring-1 outline-none transition-colors ${
                    getFieldError('contact', 'email') 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-accent focus:ring-accent'
                  }`}
                  value={contactForm.email}
                  onChange={(e) => {
                    setContactForm({...contactForm, email: e.target.value});
                    validateField('contact', 'email', e.target.value);
                  }}
                />
                {getFieldError('contact', 'email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('contact', 'email')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Il Tuo Messaggio *</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Descrivi come possiamo aiutarti..."
                  className={`w-full p-3 border rounded-md focus:ring-1 outline-none transition-colors resize-vertical ${
                    getFieldError('contact', 'message') 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-accent focus:ring-accent'
                  }`}
                  value={contactForm.message}
                  onChange={(e) => {
                    setContactForm({...contactForm, message: e.target.value});
                    validateField('contact', 'message', e.target.value);
                  }}
                ></textarea>
                {getFieldError('contact', 'message') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('contact', 'message')}</p>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Invio in corso...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Invia Messaggio</span>
                  </>
                )}
              </button>
              
              {submitStatus !== 'idle' && (
                <FormMessage status={submitStatus} message={submitMessage} />
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Property Inquiry Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Richiesta Informazioni Proprietà</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Richiedi Informazioni
              </h3>
              <p className="text-gray-600">
                Interessato a questa proprietà? Compila il modulo per ricevere informazioni dettagliate.
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('property-inquiry', propertyInquiry);
            }} className="space-y-6">
              <div className="bg-accent/5 p-4 rounded-lg flex items-center space-x-3">
                <Home className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-semibold text-primary">Riferimento Immobile</div>
                  <div className="text-accent font-bold">{propertyInquiry.propertyRef}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome e Cognome *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Il tuo nome completo"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={propertyInquiry.name}
                    onChange={(e) => setPropertyInquiry({...propertyInquiry, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono</label>
                  <input 
                    type="tel" 
                    placeholder="+39 xxx xxx xxxx"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={propertyInquiry.phone}
                    onChange={(e) => setPropertyInquiry({...propertyInquiry, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="la.tua.email@esempio.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  value={propertyInquiry.email}
                  onChange={(e) => setPropertyInquiry({...propertyInquiry, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Messaggio</label>
                <textarea 
                  rows={4}
                  placeholder="Domande specifiche sulla proprietà..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-vertical"
                  value={propertyInquiry.message}
                  onChange={(e) => setPropertyInquiry({...propertyInquiry, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Invio in corso...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Invia Richiesta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Viewing Request Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Prenotazione Visita</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Prenota una Visita
              </h3>
              <p className="text-gray-600 mb-6">
                Utilizza il nostro sistema di prenotazione avanzato per organizzare una visita personalizzata con uno dei nostri agenti esperti.
              </p>
              
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">Sistema di Prenotazione Avanzato</h4>
                <p className="text-gray-600 text-sm mb-6">
                  Seleziona data e ora, inserisci i tuoi dati e ricevi conferma immediata via email.
                </p>
                
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Apri Calendario Prenotazioni</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Calendario interattivo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Conferma immediata</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Agente dedicato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Contact Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Contatto Agente</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Contatta un Agente
              </h3>
              <p className="text-gray-600">
                Parla direttamente con uno dei nostri agenti esperti per una consulenza personalizzata.
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('agent-contact', agentContact);
            }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome e Cognome *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Il tuo nome completo"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={agentContact.name}
                    onChange={(e) => setAgentContact({...agentContact, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono</label>
                  <input 
                    type="tel" 
                    placeholder="+39 xxx xxx xxxx"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={agentContact.phone}
                    onChange={(e) => setAgentContact({...agentContact, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="la.tua.email@esempio.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  value={agentContact.email}
                  onChange={(e) => setAgentContact({...agentContact, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Metodo di Contatto Preferito</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value="email"
                      checked={agentContact.contactMethod === 'email'}
                      onChange={(e) => setAgentContact({...agentContact, contactMethod: e.target.value})}
                      className="text-accent focus:ring-accent"
                    />
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span>Email</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value="phone"
                      checked={agentContact.contactMethod === 'phone'}
                      onChange={(e) => setAgentContact({...agentContact, contactMethod: e.target.value})}
                      className="text-accent focus:ring-accent"
                    />
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span>Telefono</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Il Tuo Messaggio</label>
                <textarea 
                  rows={4}
                  placeholder="Descrivi le tue esigenze immobiliari..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-vertical"
                  value={agentContact.message}
                  onChange={(e) => setAgentContact({...agentContact, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Invio...</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>Contatta Agente</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Iscrizione Newsletter</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Iscriviti alla Nostra Newsletter
              </h3>
              <p className="text-gray-600">
                Ricevi in anteprima le migliori opportunità immobiliari e gli aggiornamenti del mercato.
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('newsletter', newsletter);
            }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Indirizzo Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="la.tua.migliore.email@esempio.com"
                  className={`w-full p-4 border rounded-md focus:ring-1 outline-none transition-colors text-lg ${
                    getFieldError('newsletter', 'email') 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-accent focus:ring-accent'
                  }`}
                  value={newsletter.email}
                  onChange={(e) => {
                    setNewsletter({...newsletter, email: e.target.value});
                    validateField('newsletter', 'email', e.target.value);
                  }}
                />
                {getFieldError('newsletter', 'email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('newsletter', 'email')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">I tuoi interessi (facoltativo)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={newsletter.preferences.luxury}
                      onChange={(e) => setNewsletter({
                        ...newsletter, 
                        preferences: {...newsletter.preferences, luxury: e.target.checked}
                      })}
                      className="text-accent focus:ring-accent rounded"
                    />
                    <span>Proprietà di Lusso</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={newsletter.preferences.investment}
                      onChange={(e) => setNewsletter({
                        ...newsletter, 
                        preferences: {...newsletter.preferences, investment: e.target.checked}
                      })}
                      className="text-accent focus:ring-accent rounded"
                    />
                    <span>Investimenti</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={newsletter.preferences.commercial}
                      onChange={(e) => setNewsletter({
                        ...newsletter, 
                        preferences: {...newsletter.preferences, commercial: e.target.checked}
                      })}
                      className="text-accent focus:ring-accent rounded"
                    />
                    <span>Immobili Commerciali</span>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iscrizione...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Iscriviti</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Property Valuation Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">Richiesta Valutazione Immobile</h3>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Richiedi una Valutazione Gratuita
              </h3>
              <p className="text-gray-600">
                I nostri esperti valuteranno la tua proprietà al prezzo di mercato attuale in modo completamente gratuito.
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit('valuation', valuation);
            }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome e Cognome *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Il tuo nome completo"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={valuation.name}
                    onChange={(e) => setValuation({...valuation, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+39 xxx xxx xxxx"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={valuation.phone}
                    onChange={(e) => setValuation({...valuation, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="la.tua.email@esempio.com"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  value={valuation.email}
                  onChange={(e) => setValuation({...valuation, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Indirizzo dell'Immobile *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Via, numero, città, provincia"
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  value={valuation.address}
                  onChange={(e) => setValuation({...valuation, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SearchableMultiSelect
                    label="Tipologia *"
                    options={valuationPropertyTypeOptions}
                    selectedValues={valuation.propertyType}
                    onSelectionChange={(values) => setValuation({...valuation, propertyType: values})}
                    placeholder="Seleziona tipologia"
                    allowSelectAll={true}
                    showSearch={true}
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Superficie (mq) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Es. 120"
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                    value={valuation.area}
                    onChange={(e) => setValuation({...valuation, area: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Note aggiuntive</label>
                <textarea 
                  rows={4}
                  placeholder="Ristrutturazioni, caratteristiche particolari, stato dell'immobile..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-vertical"
                  value={valuation.message}
                  onChange={(e) => setValuation({...valuation, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white px-6 py-4 text-lg font-bold uppercase rounded-md hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Invio Richiesta...</span>
                  </>
                ) : (
                  <>
                    <Euro className="w-5 h-5" />
                    <span>Richiedi Valutazione</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Calendar Booking Modal */}
      <CalendarBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        propertyTitle="Proprietà di Esempio"
        propertyId="FORM_DEMO"
      />
    </div>
  );
};

export { FormLayouts };