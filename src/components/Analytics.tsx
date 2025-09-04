import React from 'react';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Users, 
  Clock, 
  FileText,
  Download,
  Filter
} from 'lucide-react';

const departmentData = [
  { name: 'Operations', documents: 1247, percentage: 32, color: 'bg-blue-500' },
  { name: 'Engineering', documents: 892, percentage: 23, color: 'bg-green-500' },
  { name: 'Safety & Security', documents: 654, percentage: 17, color: 'bg-red-500' },
  { name: 'Procurement', documents: 523, percentage: 14, color: 'bg-orange-500' },
  { name: 'HR', documents: 387, percentage: 10, color: 'bg-purple-500' },
  { name: 'Planning', documents: 156, percentage: 4, color: 'bg-teal-500' }
];

const monthlyTrends = [
  { month: 'Sep', uploads: 2340, processed: 2298 },
  { month: 'Oct', uploads: 2567, processed: 2523 },
  { month: 'Nov', uploads: 2890, processed: 2867 },
  { month: 'Dec', uploads: 3200, processed: 3178 },
  { month: 'Jan', uploads: 2847, processed: 2832 }
];

const processingMetrics = [
  {
    title: 'Average Processing Time',
    value: '1.8 seconds',
    change: '-0.3s',
    trend: 'down',
    icon: Clock
  },
  {
    title: 'Accuracy Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp
  },
  {
    title: 'Documents This Month',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    icon: FileText
  },
  {
    title: 'Active Users',
    value: '156',
    change: '+8',
    trend: 'up',
    icon: Users
  }
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into document processing and system performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter Data</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {processingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Documents by Department</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${dept.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      <span className="text-sm text-gray-600">{dept.documents}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${dept.color} transition-all duration-500`}
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{dept.percentage}% of total</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Processing Trends</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{month.month} 2025</span>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{month.processed}</span>
                        <span className="text-gray-500">/{month.uploads}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(month.processed / month.uploads) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {((month.processed / month.uploads) * 100).toFixed(1)}% processed
                      </span>
                      <span className="text-xs text-gray-500">
                        {month.uploads - month.processed} pending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Processing Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
              <div className="text-sm text-gray-600">Categorization Accuracy</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">91.8%</div>
              <div className="text-sm text-gray-600">Summary Quality Score</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '91.8%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">96.7%</div>
              <div className="text-sm text-gray-600">Language Detection</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="h-2 bg-orange-500 rounded-full" style={{ width: '96.7%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Health & Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">AI Processing</p>
                <p className="text-xs text-gray-600">Online - 99.9% uptime</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">Healthy - 2.1ms latency</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Storage</p>
                <p className="text-xs text-gray-600">Available - 78% used</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">API Response</p>
                <p className="text-xs text-gray-600">Fast - 245ms avg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}