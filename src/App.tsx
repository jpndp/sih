import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentList } from './components/DocumentList';
import { ComplianceTracker } from './components/ComplianceTracker';
import { Search } from './components/Search';
import { Analytics } from './components/Analytics';

type View = 'dashboard' | 'upload' | 'documents' | 'compliance' | 'search' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <DocumentUpload />;
      case 'documents':
        return <DocumentList />;
      case 'compliance':
        return <ComplianceTracker />;
      case 'search':
        return <Search />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        } pt-16`}>
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;