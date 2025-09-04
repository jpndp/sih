import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  Filter, 
  Calendar, 
  Tag, 
  User, 
  FileText,
  Download,
  Eye,
  Clock
} from 'lucide-react';

const searchResults = [
  {
    id: '1',
    title: 'Metro Rail Safety Guidelines 2025',
    content: 'Updated safety guidelines for metro rail operations including emergency procedures, platform safety protocols, and passenger safety measures...',
    department: 'Safety & Security',
    author: 'Chief Safety Officer',
    date: '2025-01-15',
    type: 'Policy Document',
    relevanceScore: 95,
    highlights: ['safety protocols', 'emergency procedures', 'platform operations']
  },
  {
    id: '2',
    title: 'Vendor Performance Review - SKF Bearings',
    content: 'Quarterly performance analysis of SKF as bearing supplier including delivery timeliness, quality metrics, cost analysis...',
    department: 'Procurement',
    author: 'Procurement Manager',
    date: '2025-01-14',
    type: 'Vendor Report',
    relevanceScore: 88,
    highlights: ['vendor performance', 'quality metrics', 'cost analysis']
  },
  {
    id: '3',
    title: 'Rolling Stock Maintenance Schedule - March 2025',
    content: 'Detailed maintenance schedule for all rolling stock units including preventive maintenance, component replacements...',
    department: 'Engineering',
    author: 'Maintenance Manager',
    date: '2025-01-13',
    type: 'Maintenance Schedule',
    relevanceScore: 82,
    highlights: ['maintenance schedule', 'rolling stock', 'preventive maintenance']
  },
  {
    id: '4',
    title: 'Staff Training Program - Q1 2025',
    content: 'Comprehensive training program for Q1 2025 including operator certification, safety training, customer service...',
    department: 'Human Resources',
    author: 'Training Coordinator',
    date: '2025-01-12',
    type: 'Training Manual',
    relevanceScore: 76,
    highlights: ['training program', 'operator certification', 'customer service']
  }
];

const quickFilters = [
  { label: 'Safety Documents', count: 156, active: false },
  { label: 'This Week', count: 89, active: false },
  { label: 'High Priority', count: 34, active: false },
  { label: 'Malayalam', count: 67, active: false },
  { label: 'Compliance', count: 45, active: false }
];

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [dateRange, setDateRange] = useState('All');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advanced Document Search</h1>
        <p className="text-gray-600 mt-2">
          Search across all documents with AI-powered content understanding
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for documents, content, policies, or specific topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Quick filters:</span>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  <span>{filter.label}</span>
                  <span className="text-xs text-gray-500">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Operations">Operations</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Safety & Security">Safety & Security</option>
                  <option value="Procurement">Procurement</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Policy Document">Policy Document</option>
                  <option value="Safety Bulletin">Safety Bulletin</option>
                  <option value="Maintenance Report">Maintenance Report</option>
                  <option value="Training Manual">Training Manual</option>
                  <option value="Vendor Report">Vendor Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results ({searchResults.length} found)
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Search completed in 0.24s</span>
          </div>
        </div>

        {searchResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {result.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {result.relevanceScore}% match
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{result.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(result.date).toLocaleDateString()}</span>
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {result.department}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {result.type}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{result.content}</p>

            {/* Highlighted Keywords */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-700">Key highlights:</span>
              <div className="flex flex-wrap gap-1">
                {result.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                  >
                    <Tag className="w-2 h-2" />
                    <span>{highlight}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Search Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">Natural Language:</p>
            <p>"Show me safety documents from last week"</p>
          </div>
          <div>
            <p className="font-medium mb-1">Specific Queries:</p>
            <p>"maintenance reports for train 101"</p>
          </div>
          <div>
            <p className="font-medium mb-1">Department Filter:</p>
            <p>"dept:engineering brake components"</p>
          </div>
          <div>
            <p className="font-medium mb-1">Date Range:</p>
            <p>"after:2025-01-01 procurement invoices"</p>
          </div>
        </div>
      </div>
    </div>
  );
}