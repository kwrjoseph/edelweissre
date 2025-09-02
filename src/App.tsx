import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { Header } from './components/Header';
import { MainPlatform } from './components/MainPlatform';
import { Dashboard } from './components/Dashboard';
import { DashboardPreview } from './components/DashboardPreview';
import { ComponentsShowcase } from './components/ComponentsShowcase';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ContentFormsShowcase } from './pages/ContentFormsShowcase';
import MapShowcase from './pages/MapShowcase';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<MainPlatform />} />
              <Route path="/components" element={<ComponentsShowcase />} />
              <Route path="/property-detail" element={<PropertyDetailPage />} />
              <Route path="/content-forms" element={<ContentFormsShowcase />} />
              <Route path="/maps" element={<MapShowcase />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-preview" element={<DashboardPreview />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;