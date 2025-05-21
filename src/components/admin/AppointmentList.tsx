import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAudit } from '../../contexts/AuditContext';
import AppointmentStatusBadge from '../common/AppointmentStatusBadge';
import Button from '../common/Button';
import { Check, X, Edit, Trash2, Search } from 'lucide-react';
import AppointmentEditModal from './AppointmentEditModal';
import AppointmentConfirmModal from './AppointmentConfirmModal';

const AppointmentList: React.FC = () => {
  const { t } = useLanguage();
  const { appointments, updateAppointment, deleteAppointment, filterAppointments } = useAppointments();
  const { user, hasPermission } = useAuth();
  const { logAction } = useAudit();
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Modal states
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'confirm' | 'cancel' | 'delete' } | null>(null);
  
  // Filter appointments based on user role
  const userAppointments = React.useMemo(() => {
    if (user?.role === 'doctor') {
      return appointments.filter(a => a.doctorId === user.doctorId);
    }
    return appointments;
  }, [appointments, user]);
  
  const filteredAppointments = filterAppointments(
    statusFilter === 'all' ? undefined : statusFilter,
    searchTerm,
    dateFilter
  );
  
  const handleStatusChange = async (id: string, status: 'confirmed' | 'canceled') => {
    if (!hasPermission('update_appointments')) return;
    
    const appointment = await updateAppointment(id, { status });
    if (appointment) {
      await logAction({
        action: 'update',
        resourceType: 'appointment',
        resourceId: id,
        details: `Appointment status changed to ${status}`
      });
    }
    setConfirmAction(null);
  };
  
  const handleDeleteAppointment = async (id: string) => {
    if (!hasPermission('delete_appointments')) return;
    
    await deleteAppointment(id);
    await logAction({
      action: 'delete',
      resourceType: 'appointment',
      resourceId: id,
      details: 'Appointment deleted'
    });
    setConfirmAction(null);
  };
  
  const openEditModal = (id: string) => {
    if (!hasPermission('update_appointments')) return;
    setEditingAppointment(id);
  };
  
  const closeEditModal = () => {
    setEditingAppointment(null);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{t('admin.dashboard.appointments')}</h2>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">{t('admin.dashboard.all')}</option>
              <option value="pending">{t('admin.dashboard.pending')}</option>
              <option value="confirmed">{t('admin.dashboard.confirmed')}</option>
              <option value="canceled">{t('admin.dashboard.canceled')}</option>
            </select>
          </div>
          
          {/* Date filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {filteredAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.date')} / {t('admin.appointment.time')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.patient')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.phone')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.reason')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.appointment.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AppointmentStatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.patientName}</div>
                    {appointment.email && (
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {appointment.status === 'pending' && hasPermission('update_appointments') && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            icon={<Check size={16} />}
                            onClick={() => setConfirmAction({ id: appointment.id, action: 'confirm' })}
                          >
                            {t('admin.appointment.confirm')}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={() => setConfirmAction({ id: appointment.id, action: 'cancel' })}
                          >
                            {t('admin.appointment.reject')}
                          </Button>
                        </>
                      )}
                      {hasPermission('update_appointments') && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Edit size={16} />}
                          onClick={() => openEditModal(appointment.id)}
                        >
                          {t('admin.appointment.edit')}
                        </Button>
                      )}
                      {hasPermission('delete_appointments') && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Trash2 size={16} />}
                          onClick={() => setConfirmAction({ id: appointment.id, action: 'delete' })}
                        >
                          {t('admin.appointment.delete')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">{t('admin.appointment.nodata')}</p>
        </div>
      )}
      
      {/* Edit modal */}
      {editingAppointment && (
        <AppointmentEditModal
          appointmentId={editingAppointment}
          onClose={closeEditModal}
        />
      )}
      
      {/* Confirm action modal */}
      {confirmAction && (
        <AppointmentConfirmModal
          action={confirmAction.action}
          onConfirm={() => {
            if (confirmAction.action === 'delete') {
              handleDeleteAppointment(confirmAction.id);
            } else {
              handleStatusChange(
                confirmAction.id,
                confirmAction.action === 'confirm' ? 'confirmed' : 'canceled'
              );
            }
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default AppointmentList;