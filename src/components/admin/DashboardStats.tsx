import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { format, isToday } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, UserCheck, UserX, Clock, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../common/Button';

const DashboardStats: React.FC = () => {
  const { t } = useLanguage();
  const { appointments } = useAppointments();

  // Calculate stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const canceledAppointments = appointments.filter(a => a.status === 'canceled').length;
  const todayAppointments = appointments.filter(a => isToday(new Date(a.date))).length;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const chartData = last7Days.map(date => ({
    date: format(new Date(date), 'MMM dd'),
    appointments: appointments.filter(a => a.date === date).length
  }));

  const stats = [
    {
      title: t('admin.dashboard.total'),
      value: totalAppointments,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: t('admin.dashboard.pending'),
      value: pendingAppointments,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: t('admin.dashboard.confirmed'),
      value: confirmedAppointments,
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: t('admin.dashboard.canceled'),
      value: canceledAppointments,
      icon: <UserX className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 text-red-800'
    },
    {
      title: t('admin.dashboard.today'),
      value: todayAppointments,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Appointments Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
    
    // Add statistics
    doc.setFontSize(14);
    doc.text('Statistics', 14, 40);
    
    const statsData = [
      ['Total Appointments', totalAppointments.toString()],
      ['Pending Appointments', pendingAppointments.toString()],
      ['Confirmed Appointments', confirmedAppointments.toString()],
      ['Canceled Appointments', canceledAppointments.toString()],
      ['Today\'s Appointments', todayAppointments.toString()]
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Add appointments table
    doc.addPage();
    
    const appointmentsData = appointments.map(appointment => [
      appointment.date,
      appointment.time,
      appointment.patientName,
      appointment.phoneNumber,
      appointment.status
    ]);
    
    autoTable(doc, {
      startY: 20,
      head: [['Date', 'Time', 'Patient', 'Phone', 'Status']],
      body: appointmentsData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save('appointments-report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('admin.dashboard.title')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
            <div className={`${stat.color} dark:bg-opacity-10 px-4 py-2`}>
              <div className="text-sm"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t('admin.dashboard.weeklyStats')}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;