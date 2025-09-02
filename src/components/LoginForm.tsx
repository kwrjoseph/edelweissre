import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { Input } from './Input';
import { Button } from './Button';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'L\'email è richiesta';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato email non valido';
    }
    
    if (!password) {
      newErrors.password = 'La password è richiesta';
    } else if (password.length < 6) {
      newErrors.password = 'La password deve essere di almeno 6 caratteri';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await login(email, password);
      addToast('Accesso effettuato con successo!', 'success');
      onSuccess();
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : 'Errore durante l\'accesso', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Per questo demo, inserisci qualsiasi email e password valide.
        </p>
      </div>
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="mario.rossi@example.com"
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Inserisci la tua password"
        required
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Non hai un account?{' '}
          <button 
            type="button"
            className="text-[#e3ae61] hover:underline font-medium"
            onClick={() => addToast('Funzionalità di registrazione disponibile nella versione completa', 'warning')}
          >
            Registrati qui
          </button>
        </p>
      </div>
    </form>
  );
}