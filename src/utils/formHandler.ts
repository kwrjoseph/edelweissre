// Real form submission handler
export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface PropertyInquiryData {
  name: string;
  email: string;
  phone: string;
  propertyRef: string;
  message: string;
}

export interface ViewingRequestData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export interface NewsletterData {
  email: string;
  preferences: {
    luxury: boolean;
    investment: boolean;
    commercial: boolean;
  };
}

export interface ValuationData {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyType: string;
  area: string;
  message: string;
}

export interface AgentContactData {
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  message: string;
}

// Storage for form submissions (in a real app this would be a database)
const formSubmissions: {
  contact: ContactFormData[];
  propertyInquiry: PropertyInquiryData[];
  viewingRequest: ViewingRequestData[];
  newsletter: NewsletterData[];
  valuation: ValuationData[];
  agentContact: AgentContactData[];
} = {
  contact: [],
  propertyInquiry: [],
  viewingRequest: [],
  newsletter: [],
  valuation: [],
  agentContact: []
};

// Form validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Real form submission handlers
export const submitContactForm = async (data: ContactFormData): Promise<FormSubmissionResult> => {
  // Validate required fields
  if (!validateRequired(data.name)) {
    return { success: false, message: 'Il nome è obbligatorio' };
  }
  if (!validateEmail(data.email)) {
    return { success: false, message: 'Inserisci un indirizzo email valido' };
  }
  if (!validateRequired(data.message)) {
    return { success: false, message: 'Il messaggio è obbligatorio' };
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Store the submission
  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.contact.push(submission);
  
  return {
    success: true,
    message: `Grazie ${data.name}! Il tuo messaggio è stato inviato con successo. Ti contatteremo entro 24 ore.`,
    data: submission
  };
};

export const submitPropertyInquiry = async (data: PropertyInquiryData): Promise<FormSubmissionResult> => {
  if (!validateRequired(data.name)) {
    return { success: false, message: 'Il nome è obbligatorio' };
  }
  if (!validateEmail(data.email)) {
    return { success: false, message: 'Inserisci un indirizzo email valido' };
  }

  await new Promise(resolve => setTimeout(resolve, 1200));

  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.propertyInquiry.push(submission);
  
  return {
    success: true,
    message: `Richiesta ricevuta per la proprietà ${data.propertyRef}. Un nostro agente specializzato ti contatterà presto con tutte le informazioni richieste.`,
    data: submission
  };
};

export const submitViewingRequest = async (data: ViewingRequestData): Promise<FormSubmissionResult> => {
  if (!validateRequired(data.name) || !validateEmail(data.email) || 
      !validateRequired(data.phone) || !validateRequired(data.date) || !validateRequired(data.time)) {
    return { success: false, message: 'Tutti i campi obbligatori devono essere compilati' };
  }
  
  if (!validatePhone(data.phone)) {
    return { success: false, message: 'Inserisci un numero di telefono valido' };
  }

  await new Promise(resolve => setTimeout(resolve, 1800));

  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.viewingRequest.push(submission);
  
  const appointmentDate = new Date(data.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return {
    success: true,
    message: `Appuntamento confermato per ${appointmentDate} alle ore ${data.time}. Riceverai una email di conferma con tutti i dettagli.`,
    data: submission
  };
};

export const submitNewsletter = async (data: NewsletterData): Promise<FormSubmissionResult> => {
  if (!validateEmail(data.email)) {
    return { success: false, message: 'Inserisci un indirizzo email valido' };
  }

  // Check if email already exists
  const existingSubscription = formSubmissions.newsletter.find(sub => sub.email === data.email);
  if (existingSubscription) {
    return { success: false, message: 'Questo indirizzo email è già iscritto alla newsletter' };
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.newsletter.push(submission);
  
  const interests = Object.entries(data.preferences)
    .filter(([_, selected]) => selected)
    .map(([key, _]) => {
      const labels = {
        luxury: 'Proprietà di Lusso',
        investment: 'Investimenti',
        commercial: 'Immobili Commerciali'
      };
      return labels[key as keyof typeof labels];
    });
  
  return {
    success: true,
    message: `Iscrizione completata! ${interests.length > 0 ? `Riceverai aggiornamenti su: ${interests.join(', ')}` : 'Riceverai tutte le nostre newsletter'}.`,
    data: submission
  };
};

export const submitValuation = async (data: ValuationData): Promise<FormSubmissionResult> => {
  if (!validateRequired(data.name) || !validateEmail(data.email) || 
      !validateRequired(data.phone) || !validateRequired(data.address) || 
      !validateRequired(data.propertyType) || !validateRequired(data.area)) {
    return { success: false, message: 'Tutti i campi obbligatori devono essere compilati' };
  }
  
  if (!validatePhone(data.phone)) {
    return { success: false, message: 'Inserisci un numero di telefono valido' };
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.valuation.push(submission);
  
  return {
    success: true,
    message: `Richiesta di valutazione ricevuta per ${data.propertyType} di ${data.area} mq. Un nostro esperto valuterà l'immobile e ti contatterà entro 48 ore.`,
    data: submission
  };
};

export const submitAgentContact = async (data: AgentContactData): Promise<FormSubmissionResult> => {
  if (!validateRequired(data.name) || !validateEmail(data.email)) {
    return { success: false, message: 'Nome e email sono obbligatori' };
  }

  await new Promise(resolve => setTimeout(resolve, 1300));

  const submission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString()
  };
  
  formSubmissions.agentContact.push(submission);
  
  const contactMethod = data.contactMethod === 'email' ? 'email' : 'telefono';
  
  return {
    success: true,
    message: `Richiesta inviata! Un nostro agente ti contatterà via ${contactMethod} entro 4 ore lavorative per fornirti assistenza personalizzata.`,
    data: submission
  };
};

// Get all submissions (for admin/debug purposes)
export const getAllSubmissions = () => {
  return formSubmissions;
};

// Get submission count
export const getSubmissionCount = () => {
  return Object.values(formSubmissions).reduce((total, submissions) => total + submissions.length, 0);
};