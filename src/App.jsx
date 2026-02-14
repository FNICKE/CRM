import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DataTable from './pages/DataTable';
import Dashboard from './pages/Dashboard';
import Report from './pages/Account/Report'; // Import the new Report component
import AccountUpload from './pages/Account/Upload'; // Import the Upload component
import { ChevronRight, LayoutGrid } from 'lucide-react';

function App() {
  // State to track which page is active
  const [activeTab, setActiveTab] = useState('dashboard');

  // Helper to render the correct component based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <DataTable />;
      case 'reports':
        return <Report />;
      case 'upload':
        return <AccountUpload />;
      default:
        return <Dashboard />;
    }
  };

  // Helper to get Page Title
  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Project Overview', desc: 'Visual stats and performance at a glance.' };
      case 'accounts': return { title: 'Manage Accounts', desc: 'View, edit, and manage your account database.' };
      case 'reports': return { title: 'Analytics Reports', desc: 'Deep dive into account data and trends.' };
      case 'upload': return { title: 'Import Data', desc: 'Upload bulk account data via CSV or Excel.' };
      default: return { title: 'Dashboard', desc: '' };
    }
  };

  const { title, desc } = getPageInfo();

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] font-sans antialiased text-gray-900">
      {/* 1. Sidebar */}
      <Sidebar onNavigate={setActiveTab} activeTab={activeTab} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Modern Top Header */}
        <header className="h-[4.5rem] bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-[2rem] shrink-0 z-10">
          <div className="flex items-center gap-[0.75rem] text-[0.85rem]">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <LayoutGrid size={18} />
            </div>
            <div className="flex items-center gap-[0.5rem] text-gray-400">
              <span className="hover:text-blue-600 cursor-pointer transition-colors font-medium">CRM</span> 
              <ChevronRight size={14} /> 
              <span className="text-blue-600 font-bold capitalize tracking-tight">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-[1.5rem]">
            {/* Notification bell removed as requested */}
          </div>
        </header>

        {/* 3. Dynamic Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-[1.5rem] md:p-[2.5rem] custom-scrollbar">
          
          {/* Dynamic Page Header */}
          <div className="mb-[2.5rem] flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="animate-in slide-in-from-left duration-500">
              <h1 className="text-[1.75rem] font-black text-gray-900 tracking-tighter leading-none">
                {title}
              </h1>
              <p className="text-gray-500 text-[0.9rem] mt-2 font-medium">
                {desc}
              </p>
            </div>
            
            {/* Date Display (Optional extra touch) */}
            <div className="hidden sm:block text-right">
                <p className="text-[0.7rem] font-black text-gray-400 uppercase tracking-widest">Current Date</p>
                <p className="text-[0.9rem] font-bold text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Render the Active Page with an animation wrapper */}
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            {renderContent()}
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;