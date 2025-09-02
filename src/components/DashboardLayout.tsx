import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, MessageSquare, Menu, X, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onTabChange: (tabId: string) => void;
}

export function DashboardLayout({ children, currentSection, onTabChange }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { id: 'favorites', label: 'I Miei Preferiti', icon: Heart },
    { id: 'profile', label: 'Impostazioni Profilo', icon: User },
    { id: 'communications', label: 'Preferenze di Comunicazione', icon: MessageSquare },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Main Platform */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-[#e3ae61] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alle Proprietà
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-6">
          <Button
            variant="secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-center"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 mr-2" />
            ) : (
              <Menu className="h-5 w-5 mr-2" />
            )}
            Menu Dashboard
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className={cn(
            'lg:w-64 space-y-2',
            'lg:block',
            isMobileMenuOpen ? 'block' : 'hidden'
          )}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-[#e3ae61] rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
                        isActive 
                          ? 'bg-[#e3ae61] text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#e3ae61]'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}