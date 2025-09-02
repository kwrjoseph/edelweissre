import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { CommunicationPreferences } from '../../types/dashboard';

export function CommunicationSection() {
  const { user, updateCommunicationPreferences } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState<CommunicationPreferences>(
    user?.communication_preferences || {
      email_notifications: true,
      sms_notifications: false,
      marketing_opt_in: false,
      frequency: 'weekly'
    }
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateCommunicationPreferences(preferences);
      addToast('Preferenze salvate con successo', 'success');
    } catch (error) {
      addToast('Impossibile salvare le preferenze. Riprova.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof CommunicationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Preferenze di Comunicazione</h2>
      </div>

      {/* Notifications Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Notifiche</h3>
        
        <div className="space-y-6">
          <Switch
            checked={preferences.email_notifications}
            onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
            label="Notifiche Email"
            description="Ricevi aggiornamenti e nuove proprietà via email"
          />
          
          <Switch
            checked={preferences.sms_notifications}
            onCheckedChange={(checked) => handlePreferenceChange('sms_notifications', checked)}
            label="Notifiche SMS"
            description="Ricevi avvisi importanti tramite SMS"
          />
        </div>
      </div>

      {/* Marketing Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Marketing</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing-opt-in"
              checked={preferences.marketing_opt_in}
              onChange={(e) => handlePreferenceChange('marketing_opt_in', e.target.checked)}
              className="mt-1 h-4 w-4 text-[#e3ae61] focus:ring-[#e3ae61] border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="marketing-opt-in" className="block text-sm font-medium text-gray-900">
                Comunicazioni di Marketing
              </label>
              <p className="text-sm text-gray-500">
                Desidero ricevere comunicazioni di marketing, promozioni e offerte speciali
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Frequenza Comunicazioni</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Frequenza riepilogo preferiti
            </label>
            <div className="space-y-3">
              {[
                { value: 'daily', label: 'Giornaliero' },
                { value: 'weekly', label: 'Settimanale' },
                { value: 'monthly', label: 'Mensile' }
              ].map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`frequency-${option.value}`}
                    name="frequency"
                    value={option.value}
                    checked={preferences.frequency === option.value}
                    onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                    className="h-4 w-4 text-[#e3ae61] focus:ring-[#e3ae61] border-gray-300"
                  />
                  <label 
                    htmlFor={`frequency-${option.value}`} 
                    className="ml-3 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="min-w-40"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvataggio...' : 'Salva Preferenze'}
        </Button>
      </div>
    </div>
  );
}