import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Upload
} from 'lucide-react';

interface DashboardStats {
  documents_processed_today: number;
  pending_reviews: number;
  compliance_alerts: number;
  auto_categorized_percentage: number;
}

interface RecentDocument {
  id: string;
  title: string;
  department: string;
  priority: string;
  processed: string;
  summary: string;
}

interface ComplianceAlert {
  id: string;
  title: string;
  deadline: string;
  days_left: number;
  status: string;
}

const stats = [
  {
    title: 'Documents Processed Today',
    value: '247',
    change: '+12%',
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    title: 'Pending Reviews',
    value: '18',
    change: '-8%',
    icon: Clock,
    color: 'bg-orange-500'
  },
  {
    title: 'Compliance Alerts',
    value: '3',
    change: '+2',
    icon: AlertTriangle,
    color: 'bg-red-500'
  },
  {
    title: 'Auto-Categorized',
    value: '94%',
    change: '+3%',
    icon: CheckCircle,
    color: 'bg-green-500'
  }
];

const recentDocuments = [
  {
    title: 'Safety Bulletin #2025-001',
    department: 'Operations',
    priority: 'High',
    processed: '2 min ago',
    summary: 'New safety protocol for platform maintenance during peak hours'
  },
  {
    title: 'Vendor Invoice - SKF Bearings',
    department: 'Procurement',
    priority: 'Medium',
    processed: '15 min ago',
    summary: 'Invoice for Q1 bearing replacements, approved by Engineering'
  },
  {
    title: 'Environmental Impact Assessment',
    department: 'Planning',
    priority: 'Medium',
    processed: '1 hour ago',
    summary: 'Phase 2 corridor extension environmental clearance documentation'
  },
  {
    title: 'Training Schedule Updates',
    department: 'HR',
    priority: 'Low',
    processed: '2 hours ago',
    summary: 'Revised operator certification schedule for March 2025'
  }
];

const complianceAlerts = [
  {
    title: 'CMRS Inspection Report Due',
    deadline: 'March 15, 2025',
    daysLeft: 12,
    status: 'urgent'
  },
  {
    title: 'Environmental Clearance Renewal',
    deadline: 'April 30, 2025',
    daysLeft: 58,
    status: 'warning'
  },
  {
    title: 'Fire Safety Certificate',
    deadline: 'May 20, 2025',
    daysLeft: 78,
    status: 'normal'
  }
];

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<{
    stats: DashboardStats | null;
    recentDocuments: RecentDocument[];
    complianceAlerts: ComplianceAlert[];
  }>({
    stats: null,
    recentDocuments: [],
    complianceAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/dashboard/overview');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      // Ensure the response has the expected structure
      const safeData = {
        stats: data.stats || null,
        recentDocuments: Array.isArray(data.recent_documents) ? data.recent_documents : [],
        complianceAlerts: Array.isArray(data.compliance_alerts) ? data.compliance_alerts : []
      };
      
      setDashboardData(safeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Using fallback data.');
      // Keep the existing fallback data
    } finally {
      setLoading(false);
    }
  };

  // Use API data if available, otherwise fallback to hardcoded data
  const displayStats = dashboardData.stats ? [
    {
      title: 'Documents Processed Today',
      value: dashboardData.stats.documents_processed_today.toString(),
      change: '+12%',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Reviews',
      value: dashboardData.stats.pending_reviews.toString(),
      change: '-8%',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Compliance Alerts',
      value: dashboardData.stats.compliance_alerts.toString(),
      change: '+2',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Auto-Categorized',
      value: `${Math.round(dashboardData.stats.auto_categorized_percentage)}%`,
      change: '+3%',
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ] : stats;

  const displayRecentDocs = (dashboardData.recentDocuments && dashboardData.recentDocuments.length > 0) 
    ? dashboardData.recentDocuments.map(doc => ({
        title: doc.title,
        department: doc.department,
        priority: doc.priority,
        processed: doc.processed,
        summary: doc.summary || 'No summary available'
      }))
    : recentDocuments;

  const displayComplianceAlerts = (dashboardData.complianceAlerts && dashboardData.complianceAlerts.length > 0)
    ? dashboardData.complianceAlerts.map(alert => ({
        title: alert.title,
        deadline: alert.deadline,
        daysLeft: alert.days_left,
        status: alert.status
      }))
    : complianceAlerts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time insights into KMRL's document ecosystem</p>
          {error && (
            <p className="text-sm text-orange-600 mt-2">{error}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">AI Processing Active</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Loading dashboard data...</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from yesterday</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {displayRecentDocs.map((doc, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      doc.priority === 'High' ? 'bg-red-500' : 
                      doc.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                      <span className="text-xs text-gray-500">{doc.processed}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {doc.department}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doc.priority === 'High' ? 'bg-red-100 text-red-800' :
                        doc.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {doc.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{doc.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {displayComplianceAlerts.map((alert, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                    <span className={`w-2 h-2 rounded-full ${
                      alert.status === 'urgent' ? 'bg-red-500' :
                      alert.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Due: {alert.deadline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{alert.daysLeft} days remaining</span>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors">
              View All Compliance Items
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
            <Upload className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Bulk Upload</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
            <Zap className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">AI Summary</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
            <Users className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Team Reports</span>
          </button>
          <button className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Schedule Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}