import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Appointment } from '../../types';
import { X, User, Phone, Mail, Calendar, Clock, FileText } from 'lucide-react';

interface PatientDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  appointment,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('admin.patient.details')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.name')}</p>
              <p className="text-base text-gray-900">{appointment.patientName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.phone')}</p>
              <p className="text-base text-gray-900">{appointment.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.email')}</p>
              <p className="text-base text-gray-900">{appointment.email || '-'}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">CIN</p>
              <p className="text-base text-gray-900">{appointment.cin}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.date')}</p>
              <p className="text-base text-gray-900">{appointment.date}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.time')}</p>
              <p className="text-base text-gray-900">{appointment.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t('patient.form.reason')}</p>
              <p className="text-base text-gray-900">{appointment.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;