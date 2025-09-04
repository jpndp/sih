import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  Download, 
  Share2, 
  Eye, 
  Tag,
  Calendar,
  User
} from 'lucide-react';

const documents = [
  {
    id: '1',
    title: 'Safety Protocol Update - Platform Maintenance',
    department: 'Operations',
    type: 'Safety Bulletin',
    uploadDate: '2025-01-15',
    author: 'Safety Manager',
    priority: 'High',
    status: 'Active',
    summary: 'Updated safety protocols for platform maintenance during operational hours. Includes new lockout/tagout procedures and communication requirements.',
    tags: ['safety', 'maintenance', 'platform', 'protocol'],
    fileSize: '2.4 MB',
    language: 'English'
  },
  {
    id: '2',
    title: 'Quarterly Procurement Report - Q4 2024',
    department: 'Procurement',
    type: 'Financial Report',
    uploadDate: '2025-01-14',
    author: 'Procurement Head',
    priority: 'Medium',
    status: 'Under Review',
    summary: 'Comprehensive procurement analysis for Q4 2024 including vendor performance metrics, cost savings achieved, and recommendations for Q1 2025.',
    tags: ['procurement', 'quarterly', 'financial', 'vendor'],
    fileSize: '5.7 MB',
    language: 'English'
  },
  {
    id: '3',
    title: 'रोलिंग स्टॉक रखरखाव रिपोर्ट',
    department: 'Engineering',
    type: 'Maintenance Report',
    uploadDate: '2025-01-14',
    author: 'Chief Engineer',
    priority: 'Medium',
    status: 'Complete',
    summary: 'Monthly rolling stock maintenance report covering train availability, component replacements, and predictive maintenance recommendations.',
    tags: ['maintenance', 'rolling-stock', 'engineering', 'monthly'],
    fileSize: '3.1 MB',
    language: 'Malayalam'
  },
  {
    id: '4',
    title: 'Environmental Compliance Assessment - Phase 2',
    department: 'Planning',
    type: 'Regulatory Document',
    uploadDate: '2025-01-13',
    author: 'Environmental Officer',
    priority: 'High',
    status: 'Action Required',
    summary: 'Environmental impact assessment for Phase 2 expansion with compliance requirements and mitigation measures.',
    tags: ['environment', 'compliance', 'phase-2', 'expansion'],
    fileSize: '8.9 MB',
    language: 'English'
  },
  {
    id: '5',
    title: 'Staff Training Schedule - March 2025',
    department: 'HR',
    type: 'Training Document',
    uploadDate: '2025-01-12',
    author: 'Training Coordinator',
    priority: 'Low',
    status: 'Draft',
    summary: 'Updated training schedule for March 2025 including operator certification, safety refreshers, and new technology training.',
    tags: ['training', 'hr', 'schedule', 'certification'],
    fileSize: '1.2 MB',
    language: 'Bilingual'
  }
];

const departments = ['All Departments', 'Operations', 'Engineering', 'Procurement', 'HR', 'Planning', 'Safety'];
const priorities = ['All Priorities', 'High', 'Medium', 'Low'];
const statuses = ['All Statuses', 'Active', 'Under Review', 'Complete', 'Draft', 'Action Required'];

export function DocumentList() {
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter(doc => {
    return (
      (selectedDepartment === 'All Departments' || doc.department === selectedDepartment) &&
      (selectedPriority === 'All Priorities' || doc.priority === selectedPriority) &&
      (selectedStatus === 'All Statuses' || doc.status === selectedStatus) &&
      (searchTerm === '' || doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-orange-100 text-orange-800';
      case 'Complete': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Action Required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Library</h1>
          <p className="text-gray-600 mt-2">
            Search, filter, and manage all organizational documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">{filteredDocuments.length} documents found</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{doc.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(doc.priority)}`}>
                    {doc.priority}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{doc.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      <Tag className="w-2 h-2" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{doc.tags.length - 3} more</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Department: {doc.department}</span>
                  <span>Type: {doc.type}</span>
                  <span>Language: {doc.language}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}