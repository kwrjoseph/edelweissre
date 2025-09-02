import React, { useState } from 'react';
import { DashboardLayoutPreview } from './DashboardLayoutPreview';
import { PreviewFavoritesSection } from './dashboard/PreviewFavoritesSection';
import { ProfileSection } from './dashboard/ProfileSection';
import { CommunicationSection } from './dashboard/CommunicationSection';
import { AuthProvider } from '../contexts/AuthContext';

// Simple preview wrapper that auto-authenticates the user
function PreviewAuthWrapper({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Auto-authenticate for preview
    const mockUser = {
      id: "preview-user",
      email: "mario.rossi@example.com",
      first_name: "Mario",
      last_name: "Rossi",
      phone: "+39 348 123 4567",
      profile_picture_url: "/images/default-avatar.jpg",
      created_at: "2024-01-15T10:30:00Z",
      communication_preferences: {
        email_notifications: true,
        sms_notifications: false,
        marketing_opt_in: true,
        frequency: "weekly"
      },
      favorites: ["1", "3", "4"] // Pre-set some favorites for preview
    };
    
    localStorage.setItem('authState', 'authenticated');
    localStorage.setItem('userData', JSON.stringify(mockUser));
  }, []);
  
  return <>{children}</>;
}

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('favorites');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return <PreviewFavoritesSection />;
      case 'profile':
        return <ProfileSection />;
      case 'communications':
        return <CommunicationSection />;
      default:
        return <PreviewFavoritesSection />;
    }
  };

  return (
    <AuthProvider>
      <PreviewAuthWrapper>
        <div className="min-h-screen bg-gray-50">
          {/* Preview Banner */}
          <div className="bg-[#e3ae61] text-white text-center py-3 px-4">
            <p className="text-sm font-medium">
              🎯 <strong>Anteprima Dashboard</strong> - Questa è una versione demo con dati di esempio. 
              <span className="hidden sm:inline">
                Per l'esperienza completa con autenticazione, clicca "Accedi" nella navigazione.
              </span>
            </p>
          </div>
          
          <DashboardLayoutPreview currentSection={activeTab} onTabChange={setActiveTab}>
            {renderActiveTabContent()}
          </DashboardLayoutPreview>
        </div>
      </PreviewAuthWrapper>
    </AuthProvider>
  );
}