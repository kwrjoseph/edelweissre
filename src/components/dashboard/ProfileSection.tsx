import React, { useState } from 'react';
import { Camera, Edit3, Save, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';
import { Input } from '../Input';
import { Button } from '../Button';
import { Modal } from '../Modal';

export function ProfileSection() {
  const { user, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || ''
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
      addToast('Profilo aggiornato con successo', 'success');
    } catch (error) {
      addToast('Impossibile salvare le modifiche. Riprova.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = () => {
    // Mock profile picture upload
    addToast('Funzionalità di caricamento foto disponibile nella versione completa', 'warning');
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(false);
    addToast('Funzionalità di cambio password disponibile nella versione completa', 'warning');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'ELIMINA') {
      logout();
      addToast('Account eliminato con successo', 'success');
      setShowDeleteModal(false);
      // Redirect to home page
      window.location.href = '/';
    } else {
      addToast('Conferma digitando ELIMINA in maiuscolo', 'error');
    }
  };

  return (
    <>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Impostazioni Profilo</h2>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Foto Profilo</h3>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[#e3ae61] rounded-full flex items-center justify-center">
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="Foto profilo"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                )}
              </div>
              <button
                onClick={handleProfilePictureUpload}
                className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleProfilePictureUpload}
              >
                Carica Nuova Foto
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Informazioni Personali</h3>
            {!isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEdit}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modifica
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              disabled={!isEditing}
            />
            
            <Input
              label="Cognome"
              value={formData.last_name}
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              disabled={!isEditing}
            />
            
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled={true}
              helpText="L'email non può essere modificata"
            />
            
            <Input
              label="Telefono"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              placeholder="+39 xxx xxx xxxx"
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Annulla
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvataggio...' : 'Salva Modifiche'}
              </Button>
            </div>
          )}
        </div>

        {/* Account Settings Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Impostazioni Account</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Modifica la tua password per mantenere l'account sicuro</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPasswordModal(true)}
              >
                Cambia Password
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Zona Pericolosa</h4>
                <p className="text-sm text-red-600">Elimina definitivamente il tuo account e tutti i dati associati</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Cambia Password"
      >
        <div className="space-y-4">
          <Input
            label="Password Attuale"
            type="password"
            placeholder="Inserisci la password attuale"
          />
          <Input
            label="Nuova Password"
            type="password"
            placeholder="Inserisci la nuova password"
          />
          <Input
            label="Conferma Nuova Password"
            type="password"
            placeholder="Conferma la nuova password"
          />
          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="flex-1"
            >
              Aggiorna Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Elimina Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Attenzione:</strong> Questa azione è irreversibile. 
              Tutti i tuoi dati, preferiti e impostazioni saranno eliminati definitivamente.
            </p>
          </div>
          
          <Input
            label='Per confermare, digita "ELIMINA" in maiuscolo'
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="ELIMINA"
          />
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'ELIMINA'}
              className="flex-1"
            >
              Elimina Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}