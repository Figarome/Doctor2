import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AppointmentList from '../../components/admin/AppointmentList';
import DashboardStats from '../../components/admin/DashboardStats';
import AuditLogList from '../../components/admin/AuditLogList';
import PatientDetailsModal from '../../components/admin/PatientDetailsModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isFuture } from 'date-fns';
import { Calendar, UserCheck, UserX, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { appointments } = useAppointments();
  const { user, hasPermission } = useAuth();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = React.useState<string | null>(null);
  
  // Filter appointments based on user role
  const filteredAppointments = React.useMemo(() => {
    if (user?.role === 'doctor') {
      return appointments.filter(a => a.doctorId === user.doctorId);
    }
    return appointments;
  }, [appointments, user]);
  
  // Calculate appointment stats
  const pendingCount = filteredAppointments.filter(a => a.status === 'pending').length;
  const confirmedCount = filteredAppointments.filter(a => a.status === 'confirmed').length;
  const canceledCount = filteredAppointments.filter(a => a.status === 'canceled').length;
  
  const stats = [
    {
      name: t('admin.dashboard.all'),
      count: filteredAppointments.length,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: t('admin.dashboard.pending'),
      count: pendingCount,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: t('admin.dashboard.confirmed'),
      count: confirmedCount,
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 text-green-800',
    },
    {
      name: t('admin.dashboard.canceled'),
      count: canceledCount,
      icon: <UserX className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 text-red-800',
    },
  ];

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getAppointmentsForDay = (date: Date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.date);
      return format(appointmentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  const previousMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Dashboard */}
        <DashboardStats appointments={filteredAppointments} />

        {/* Calendar */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-white h-32 p-2" />
            ))}
            {days.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isFutureDate = isFuture(day);
              
              return (
                <div
                  key={day.toString()}
                  className={`bg-white h-32 p-2 ${
                    !isCurrentMonth ? 'text-gray-400' : ''
                  } ${isToday(day) ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-sm font-semibold ${
                      isToday(day) 
                        ? 'bg-blue-600 text-white rounded-full' 
                        : isFutureDate 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment.id)}
                        className={`flex items-center text-xs p-1 rounded w-full text-left hover:opacity-75 transition-opacity ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-50 text-green-700'
                            : appointment.status === 'canceled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate">
                          {appointment.time} - {appointment.patientName}
                        </span>
                      </button>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Appointment List */}
        <AppointmentList />

        {/* Audit Log - Only visible to admin */}
        {hasPermission('view_audit_logs') && (
          <div className="mt-8">
            <AuditLogList />
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedAppointment && (
        <PatientDetailsModal
          appointment={appointments.find(a => a.id === selectedAppointment)!}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </AdminLayout>
  );
};

export default DashboardPage;