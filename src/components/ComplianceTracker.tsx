import React from 'react';
import { 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Users,
  Target
} from 'lucide-react';

const complianceItems = [
  {
    id: '1',
    title: 'CMRS Annual Safety Inspection',
    authority: 'Commissioner of Metro Rail Safety',
    dueDate: '2025-03-15',
    status: 'urgent',
    progress: 65,
    assignedTo: 'Safety Team',
    documents: 12,
    lastUpdate: '2025-01-14',
    description: 'Annual comprehensive safety inspection covering rolling stock, infrastructure, and operational procedures.'
  },
  {
    id: '2',
    title: 'Environmental Impact Assessment Update',
    authority: 'Ministry of Environment',
    dueDate: '2025-04-30',
    status: 'warning',
    progress: 40,
    assignedTo: 'Environmental Team',
    documents: 8,
    lastUpdate: '2025-01-12',
    description: 'Environmental compliance update for Phase 2 corridor extension project.'
  },
  {
    id: '3',
    title: 'Fire Safety Certificate Renewal',
    authority: 'Kerala Fire & Rescue Services',
    dueDate: '2025-05-20',
    status: 'normal',
    progress: 25,
    assignedTo: 'Safety & Security',
    documents: 5,
    lastUpdate: '2025-01-10',
    description: 'Annual fire safety certificate renewal for all stations and depot facilities.'
  },
  {
    id: '4',
    title: 'Financial Audit Compliance',
    authority: 'Comptroller & Auditor General',
    dueDate: '2025-06-30',
    status: 'normal',
    progress: 15,
    assignedTo: 'Finance Team',
    documents: 23,
    lastUpdate: '2025-01-08',
    description: 'Annual financial audit preparation and compliance documentation submission.'
  },
  {
    id: '5',
    title: 'Accessibility Standards Review',
    authority: 'Central Government',
    dueDate: '2025-07-15',
    status: 'normal',
    progress: 10,
    assignedTo: 'Operations Team',
    documents: 7,
    lastUpdate: '2025-01-05',
    description: 'Compliance review for accessibility standards across all metro stations and facilities.'
  }
];

const overviewStats = [
  {
    title: 'Total Compliance Items',
    value: '24',
    icon: Shield,
    color: 'text-blue-600'
  },
  {
    title: 'Urgent Actions',
    value: '3',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    title: 'On Track',
    value: '18',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    title: 'Avg. Completion Rate',
    value: '87%',
    icon: Target,
    color: 'text-purple-600'
  }
];

export function ComplianceTracker() {
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'urgent') return 'bg-red-500';
    if (status === 'warning') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Tracker</h1>
          <p className="text-gray-600 mt-2">
            Monitor regulatory compliance and deadline management across all departments
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Compliance Items</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {complianceItems.map((item) => {
              const daysLeft = getDaysLeft(item.dueDate);
              
              return (
                <div
                  key={item.id}
                  className={`border-l-4 rounded-lg p-6 transition-all hover:shadow-sm ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Authority:</span>
                          <p className="text-gray-600 mt-1">{item.authority}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Assigned To:</span>
                          <p className="text-gray-600 mt-1">{item.assignedTo}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Documents:</span>
                          <p className="text-gray-600 mt-1">{item.documents} files</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        daysLeft <= 14 ? 'bg-red-100 text-red-800' :
                        daysLeft <= 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {daysLeft} days left
                      </div>
                      <p className="text-xs text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress, item.status)}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {new Date(item.lastUpdate).toLocaleDateString()}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FileText className="w-3 h-3" />
                        <span>View Documents</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Users className="w-3 h-3" />
                        <span>Assign Team</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceItems.slice(0, 3).map((item) => {
              const daysLeft = getDaysLeft(item.dueDate);
              
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{item.authority}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      daysLeft <= 14 ? 'bg-red-100 text-red-800' :
                      daysLeft <= 30 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {daysLeft} days
                    </span>
                    <span className="text-xs text-gray-500">{new Date(item.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}