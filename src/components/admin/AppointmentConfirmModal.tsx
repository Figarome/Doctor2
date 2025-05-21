import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';

interface AppointmentConfirmModalProps {
  action: 'confirm' | 'cancel' | 'delete';
  onConfirm: () => void;
  onCancel: () => void;
}

const AppointmentConfirmModal: React.FC<AppointmentConfirmModalProps> = ({
  action,
  onConfirm,
  onCancel
}) => {
  const { t } = useLanguage();
  
  const getActionMessage = () => {
    switch (action) {
      case 'confirm':
        return t('Are you sure you want to confirm this appointment?');
      case 'cancel':
        return t('Are you sure you want to cancel this appointment?');
      case 'delete':
        return t('Are you sure you want to delete this appointment? This action cannot be undone.');
      default:
        return t('admin.confirm.message');
    }
  };
  
  const getConfirmButtonVariant = () => {
    switch (action) {
      case 'confirm':
        return 'success';
      case 'cancel':
        return 'danger';
      case 'delete':
        return 'danger';
      default:
        return 'primary';
    }
  };
  
  const getConfirmButtonText = () => {
    switch (action) {
      case 'confirm':
        return t('admin.appointment.confirm');
      case 'cancel':
        return t('admin.appointment.reject');
      case 'delete':
        return t('admin.appointment.delete');
      default:
        return t('submit');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={24} className="text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-900">{t('admin.confirm.title')}</h3>
        </div>
        
        <p className="text-gray-700 mb-6">{getActionMessage()}</p>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            variant={getConfirmButtonVariant() as any}
            onClick={onConfirm}
          >
            {getConfirmButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmModal;