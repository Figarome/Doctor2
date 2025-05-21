import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../common/Button';
import { CheckCircle } from 'lucide-react';

interface AppointmentSuccessProps {
  onReset: () => void;
}

const AppointmentSuccess: React.FC<AppointmentSuccessProps> = ({ onReset }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t('patient.form.success')}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {t('patient.form.success.subtitle')}
      </p>
      
      <Button
        onClick={onReset}
        className="mt-4"
      >
        {t('patient.form.submit')}
      </Button>
    </div>
  );
};

export default AppointmentSuccess;