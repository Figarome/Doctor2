import React from 'react';
import { useAudit } from '../../contexts/AuditContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

const AuditLogList: React.FC = () => {
  const { logs } = useAudit();
  const { t } = useLanguage();

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'login':
        return 'text-purple-600';
      case 'logout':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`font-medium ${getActionColor(log.action)}`}>
                    {log.userName}
                  </span>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{log.userRole}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{log.details}</p>
              </div>
              <time className="text-xs text-gray-500">
                {format(new Date(log.timestamp), 'PPp')}
              </time>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogList;