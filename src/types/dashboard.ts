export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  property_type: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_picture_url: string;
  created_at: string;
  communication_preferences: CommunicationPreferences;
  favorites: string[];
}

export interface CommunicationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_opt_in: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleFavorite: (propertyId: string) => void;
  updateCommunicationPreferences: (preferences: CommunicationPreferences) => Promise<void>;
}
