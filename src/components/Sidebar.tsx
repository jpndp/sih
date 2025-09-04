import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Shield, 
  Search, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type View = 'dashboard' | 'upload' | 'documents' | 'compliance' | 'search' | 'analytics';

interface SidebarProps {
  isOpen: boolean;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const menuItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload' as View, label: 'Upload Documents', icon: Upload },
  { id: 'documents' as View, label: 'Document Library', icon: FileText },
  { id: 'compliance' as View, label: 'Compliance Tracker', icon: Shield },
  { id: 'search' as View, label: 'Advanced Search', icon: Search },
  { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ isOpen, currentView, setCurrentView }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">System Status</p>
            <p className="text-xs text-blue-600 mt-1">AI Processing: Online</p>
            <p className="text-xs text-blue-600">Documents Processed: 1,247</p>
          </div>
        </div>
      )}
    </aside>
  );
}