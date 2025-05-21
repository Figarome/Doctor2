import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { Appointment } from '../../types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { X } from 'lucide-react';

interface AppointmentEditModalProps {
  appointmentId: string;
  onClose: () => void;
}

const AppointmentEditModal: React.FC<AppointmentEditModalProps> = ({
  appointmentId,
  onClose
}) => {
  const { t, language } = useLanguage();
  const { getAppointmentById, updateAppointment, loading } = useAppointments();
  
  const [formData, setFormData] = useState<Partial<Appointment>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const statusOptions = [
    { value: 'pending', label: t('admin.dashboard.pending') },
    { value: 'confirmed', label: t('admin.dashboard.confirmed') },
    { value: 'canceled', label: t('admin.dashboard.canceled') },
  ];
  
  const reasonOptions = [
    { value: 'consultation', label: t('patient.form.reason.consultation') },
    { value: 'checkup', label: t('patient.form.reason.checkup') },
    { value: 'follow-up', label: t('patient.form.reason.follow-up') },
    { value: 'emergency', label: t('patient.form.reason.emergency') },
    { value: 'other', label: t('patient.form.reason.other') },
  ];
  
  useEffect(() => {
    const appointment = getAppointmentById(appointmentId);
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointmentId, getAppointmentById]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientName?.trim()) {
      newErrors.patientName = language === 'en' ? 'Name is required' : 'الاسم مطلوب';
    }
    
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = language === 'en' ? 'Please enter a valid phone number' : 'يرجى إدخال رقم هاتف صحيح';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال عنوان بريد إلكتروني صحيح';
    }
    
    if (!formData.date) {
      newErrors.date = language === 'en' ? 'Date is required' : 'التاريخ مطلوب';
    }
    
    if (!formData.time) {
      newErrors.time = language === 'en' ? 'Time is required' : 'الوقت مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateAppointment(appointmentId, formData);
      onClose();
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.appointment.edit')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <Input
              label={t('patient.form.name')}
              name="patientName"
              value={formData.patientName || ''}
              onChange={handleChange}
              error={errors.patientName}
              required
            />
            
            <Input
              label={t('patient.form.phone')}
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              error={errors.phoneNumber}
              required
            />
            
            <Input
              label={t('patient.form.email')}
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={errors.email}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('patient.form.date')}
                name="date"
                type="date"
                value={formData.date || ''}
                onChange={handleChange}
                error={errors.date}
                required
              />
              
              <Input
                label={t('patient.form.time')}
                name="time"
                type="time"
                value={formData.time || ''}
                onChange={handleChange}
                error={errors.time}
                required
              />
            </div>
            
            <Select
              label={t('patient.form.reason')}
              options={reasonOptions}
              value={formData.reason || 'consultation'}
              onChange={handleSelectChange('reason')}
              required
            />
            
            <Select
              label={t('admin.appointment.status')}
              options={statusOptions}
              value={formData.status || 'pending'}
              onChange={handleSelectChange('status')}
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSaving || loading}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentEditModal;