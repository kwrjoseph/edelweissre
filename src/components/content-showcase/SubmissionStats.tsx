import React, { useState, useEffect } from 'react';
import { CheckCircle, Users, FileText, Mail } from 'lucide-react';
import { getSubmissionCount, getAllSubmissions } from '../../utils/formHandler';

const SubmissionStats: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    contact: 0,
    newsletter: 0,
    inquiries: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const allSubmissions = getAllSubmissions();
      setStats({
        total: getSubmissionCount(),
        contact: allSubmissions.contact.length,
        newsletter: allSubmissions.newsletter.length,
        inquiries: allSubmissions.propertyInquiry.length + allSubmissions.viewingRequest.length + allSubmissions.valuation.length + allSubmissions.agentContact.length
      });
    };

    updateStats();
    // Update stats every 5 seconds to show real-time changes
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
        <h3 className="text-lg font-semibold text-green-800">Moduli Funzionanti - Dati Reali Ricevuti</h3>
      </div>
      <p className="text-green-700 mb-4">
        I moduli in questa pagina sono completamente funzionali e processano dati reali. Ecco le statistiche attuali:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-green-800">{stats.total}</div>
          <div className="text-sm text-green-600">Totale Invii</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-800">{stats.contact}</div>
          <div className="text-sm text-blue-600">Contatti</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-purple-800">{stats.newsletter}</div>
          <div className="text-sm text-purple-600">Newsletter</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-orange-800">{stats.inquiries}</div>
          <div className="text-sm text-orange-600">Richieste</div>
        </div>
      </div>
    </div>
  );
};

export { SubmissionStats };