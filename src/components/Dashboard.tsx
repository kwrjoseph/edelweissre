import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { FavoritesSection } from './dashboard/FavoritesSection';
import { ProfileSection } from './dashboard/ProfileSection';
import { CommunicationSection } from './dashboard/CommunicationSection';
import { Button } from './Button';

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Accesso Richiesto
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Devi effettuare l'accesso per visualizzare il dashboard.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return <FavoritesSection />;
      case 'profile':
        return <ProfileSection />;
      case 'communications':
        return <CommunicationSection />;
      default:
        return <FavoritesSection />;
    }
  };

  return (
    <DashboardLayout currentSection={activeTab} onTabChange={setActiveTab}>
      {renderActiveTabContent()}
    </DashboardLayout>
  );
}