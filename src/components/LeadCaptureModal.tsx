import React, { useState } from 'react';
import { X } from 'lucide-react';

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
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSubmit: (leadData: LeadFormData) => void;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  propertyId: string;
  propertyTitle: string;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  property,
  onSubmit
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
    propertyId: property?.id || '',
    propertyTitle: property?.title || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  React.useEffect(() => {
    if (property) {
      setFormData(prev => ({
        ...prev,
        propertyId: property.id,
        propertyTitle: property.title
      }));
    }
  }, [property]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Il telefono è obbligatorio';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'Devi accettare l\'informativa sulla privacy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        consent: false,
        propertyId: property?.id || '',
        propertyTitle: property?.title || ''
      });
      onClose();
    } catch (error) {
      console.error('Error submitting lead form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LeadFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">
            Richiedi Informazioni
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Property Info */}
        <div className="p-6 border-b border-border">
          <div className="flex gap-4">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-20 h-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNDBIMjA1VjE2MEgxOTVWMTQwSDE3NVYxMjBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+Cg==';
              }}
            />
            <div>
              <h3 className="font-semibold text-primary mb-1">{property.title}</h3>
              <p className="text-sm text-secondary">{property.address}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Nome e Cognome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.name ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Inserisci il tuo nome completo"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="esempio@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Telefono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.phone ? 'border-red-500' : 'border-border'
                }`}
                placeholder="+39 123 456 7890"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Messaggio (opzionale)
              </label>
              <textarea
                value={formData.message}
                onChange={handleInputChange('message')}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Scrivi qui eventuali richieste specifiche..."
              />
            </div>

            {/* Consent */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleInputChange('consent')}
                  className={`mt-1 w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded ${
                    errors.consent ? 'border-red-500' : ''
                  }`}
                />
                <span className="text-sm text-secondary">
                  Accetto l'<a href="#" className="text-accent hover:underline">informativa sulla privacy</a> e 
                  autorizzo il trattamento dei miei dati personali per ricevere informazioni commerciali. *
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-500 text-sm mt-1">{errors.consent}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border text-secondary rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Invio...' : 'Invia Richiesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;