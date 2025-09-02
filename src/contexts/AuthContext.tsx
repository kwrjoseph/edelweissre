import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, CommunicationPreferences } from '../types/dashboard';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authState = localStorage.getItem('authState');
        const userData = localStorage.getItem('userData');
        
        if (authState === 'authenticated' && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Load default mock user but not authenticated
          const response = await fetch('/data/mockUser.json');
          const mockUser = await response.json();
          setUser(mockUser);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call Supabase
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        const response = await fetch('/data/mockUser.json');
        const mockUser = await response.json();
        
        // Update email to match login
        const updatedUser = { ...mockUser, email };
        
        setUser(updatedUser);
        setIsAuthenticated(true);
        
        // Persist to localStorage
        localStorage.setItem('authState', 'authenticated');
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      } else {
        throw new Error('Email e password sono richiesti');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authState');
    localStorage.removeItem('userData');
    localStorage.removeItem('favorites');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Persist to localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const toggleFavorite = (propertyId: string) => {
    if (!user) return;
    
    const currentFavorites = [...user.favorites];
    const isFavorite = currentFavorites.includes(propertyId);
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = currentFavorites.filter(id => id !== propertyId);
    } else {
      updatedFavorites = [...currentFavorites, propertyId];
    }
    
    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);
    
    // Persist to localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const updateCommunicationPreferences = async (preferences: CommunicationPreferences) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        communication_preferences: preferences
      };
      
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating communication preferences:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    toggleFavorite,
    updateCommunicationPreferences
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e3ae61]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}