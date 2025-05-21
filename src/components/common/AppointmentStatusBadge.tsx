import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AppointmentStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'canceled';
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  const getStatusClasses = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return t('admin.dashboard.pending');
      case 'confirmed':
        return t('admin.dashboard.confirmed');
      case 'canceled':
        return t('admin.dashboard.canceled');
      default:
        return status;
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses()}`}>
      {getStatusText()}
    </span>
  );
};

export default AppointmentStatusBadge;