import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Modal } from './Modal';
import { LoginForm } from './LoginForm';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#e3ae61]">
                RealEstate<span className="text-primary">Pro</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`transition-colors font-medium ${
                  location.pathname === '/' 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Proprietà
              </Link>
              <Link 
                to="/components" 
                className={`transition-colors font-medium ${
                  location.pathname.startsWith('/components') 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Componenti
              </Link>
              <Link 
                to="/maps" 
                className={`transition-colors font-medium ${
                  location.pathname.startsWith('/maps') 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Mappe
              </Link>
              <Link 
                to="/dashboard-preview" 
                className={`transition-colors font-medium ${
                  location.pathname.startsWith('/dashboard-preview') 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Anteprima Dashboard
              </Link>
              <Link 
                to="/property-detail" 
                className={`transition-colors font-medium ${
                  location.pathname.startsWith('/property-detail') 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Dettaglio Proprietà
              </Link>
              <Link 
                to="/content-forms" 
                className={`transition-colors font-medium ${
                  location.pathname.startsWith('/content-forms') 
                    ? 'text-[#e3ae61]' 
                    : 'text-gray-600 hover:text-[#e3ae61]'
                }`}
              >
                Contenuti & Moduli
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#e3ae61] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block font-medium">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/dashboard/favorites"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>I Miei Preferiti</span>
                      </Link>
                      
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Impostazioni Profilo</span>
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Disconnetti</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="primary"
                >
                  Accedi
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Accedi al tuo Account"
      >
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
}