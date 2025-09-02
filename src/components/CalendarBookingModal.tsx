import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, User, Phone, Mail, MessageCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface CalendarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyId?: string;
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  message: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const CalendarBookingModal: React.FC<CalendarBookingModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = "Proprietà selezionata",
  propertyId
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedDate: '',
    selectedTime: '',
    message: '',
    preferredContact: 'phone'
  });

  // Available time slots (in real app, this would come from API)
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: false }
  ];

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setBookingConfirmed(false);
      setBookingData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        selectedDate: '',
        selectedTime: '',
        message: '',
        preferredContact: 'phone'
      });
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

  // Generate calendar dates
  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get first day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    
    const dates = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isSelected = bookingData.selectedDate === date.toISOString().split('T')[0];
      
      dates.push({
        day,
        date,
        isPast,
        isWeekend,
        isSelected,
        available: !isPast && !isWeekend // Simple availability logic
      });
    }
    
    return dates;
  };

  const handleDateSelect = (date: Date) => {
    setBookingData(prev => ({
      ...prev,
      selectedDate: date.toISOString().split('T')[0],
      selectedTime: '' // Reset time when date changes
    }));
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, selectedTime: time }));
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = bookingData.selectedDate && bookingData.selectedTime;
  const canProceedToStep3 = bookingData.firstName && bookingData.lastName && bookingData.email && bookingData.phone;

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">Prenota una Visita</h2>
                <p className="text-gray-600 text-sm">{propertyTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center mt-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-accent text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {bookingConfirmed && step === 3 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-accent' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Data e Ora</span>
              <span>Dettagli</span>
              <span>Conferma</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Date and Time Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">Seleziona Data e Ora</h3>
                  
                  {/* Calendar */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <h4 className="text-xl font-semibold text-primary">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h4>
                      
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDates().map((dateObj, index) => {
                        if (!dateObj) {
                          return <div key={index} className="p-2" />;
                        }
                        
                        return (
                          <button
                            key={index}
                            onClick={() => dateObj.available && handleDateSelect(dateObj.date)}
                            disabled={!dateObj.available}
                            className={`p-3 text-sm rounded-lg transition-all duration-200 ${
                              dateObj.isSelected
                                ? 'bg-accent text-white font-semibold'
                                : dateObj.available
                                  ? 'hover:bg-white hover:shadow-sm text-gray-700'
                                  : 'text-gray-300 cursor-not-allowed'
                            } ${
                              dateObj.isPast || dateObj.isWeekend
                                ? 'bg-gray-100'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            {dateObj.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Time Slots */}
                  {bookingData.selectedDate && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-primary mb-4">Seleziona Orario</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                              bookingData.selectedTime === slot.time
                                ? 'bg-accent text-white'
                                : slot.available
                                  ? 'bg-white border-2 border-gray-200 hover:border-accent text-gray-700'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            <span>{slot.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Selected Date/Time Summary */}
                {bookingData.selectedDate && bookingData.selectedTime && (
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">Appuntamento Selezionato</p>
                        <p className="text-gray-700">
                          {new Date(bookingData.selectedDate).toLocaleDateString('it-IT', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} alle ore {bookingData.selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: User Details Form */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4">I tuoi Dati</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="Il tuo nome"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          value={bookingData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cognome *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="Il tuo cognome"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          value={bookingData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="la.tua.email@esempio.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          value={bookingData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          placeholder="+39 xxx xxx xxxx"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          value={bookingData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Preferred Contact Method */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Modalità di contatto preferita
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'phone', label: 'Telefono', icon: Phone },
                        { key: 'email', label: 'Email', icon: Mail },
                        { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleInputChange('preferredContact', key as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                            bookingData.preferredContact === key
                              ? 'border-accent bg-accent/5 text-accent'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Message */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Messaggio aggiuntivo (opzionale)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Eventuali richieste specifiche o domande sulla proprietà..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-vertical"
                      value={bookingData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {!bookingConfirmed ? (
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-6">Conferma la tua Prenotazione</h3>
                    
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Data e ora:</span>
                        <span className="font-semibold text-primary">
                          {new Date(bookingData.selectedDate).toLocaleDateString('it-IT')} alle {bookingData.selectedTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Nome:</span>
                        <span className="font-semibold">{bookingData.firstName} {bookingData.lastName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="font-semibold">{bookingData.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Telefono:</span>
                        <span className="font-semibold">{bookingData.phone}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Contatto preferito:</span>
                        <span className="font-semibold capitalize">{bookingData.preferredContact}</span>
                      </div>
                      
                      {bookingData.message && (
                        <div>
                          <span className="font-medium text-gray-700 block mb-2">Messaggio:</span>
                          <p className="text-gray-600 italic">"{bookingData.message}"</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> La prenotazione sarà confermata entro 2 ore lavorative. 
                        Riceverai una conferma via email con i dettagli dell'appuntamento e le informazioni di contatto dell'agente.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Confirmation Success */
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Prenotazione Confermata!</h3>
                    
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      La tua richiesta di visita è stata inviata con successo. Riceverai una conferma via email entro 2 ore lavorative.
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-green-800">
                        <strong>Appuntamento:</strong><br />
                        {new Date(bookingData.selectedDate).toLocaleDateString('it-IT', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}<br />
                        alle ore {bookingData.selectedTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!bookingConfirmed && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={currentStep === 1 ? onClose : handlePrevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  {currentStep === 1 ? 'Annulla' : 'Indietro'}
                </button>
                
                <button
                  onClick={currentStep === 3 ? handleSubmitBooking : handleNextStep}
                  disabled={
                    (currentStep === 1 && !canProceedToStep2) ||
                    (currentStep === 2 && !canProceedToStep3) ||
                    isSubmitting
                  }
                  className="px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Invio...</span>
                    </>
                  ) : currentStep === 3 ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Conferma Prenotazione</span>
                    </>
                  ) : (
                    'Continua'
                  )}
                </button>
              </div>
            </div>
          )}
          
          {bookingConfirmed && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={onClose}
                className="w-full px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Chiudi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarBookingModal;