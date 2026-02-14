import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  FileText, 
  Upload, 
  ChevronDown, 
  ChevronUp,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ onNavigate, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [openMenus, setOpenMenus] = useState({
    account: true, 
    // you can add others later if needed
  });

  useEffect(() => {
    const accountSubItems = ['accounts', 'reports', 'upload'];
    if (accountSubItems.includes(activeTab)) {
      setOpenMenus(prev => ({ ...prev, account: true }));
    }
  }, [activeTab]);

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleNavClick = (id) => {
    if (onNavigate) onNavigate(id);
    setIsOpen(false); // close on mobile after click
  };

  const NavItem = ({ icon: Icon, label, id, isSubItem = false }) => {
    const isActive = activeTab === id;
    
    return (
      <div 
        onClick={() => handleNavClick(id)}
        className={`
          flex items-center gap-3 px-4 py-2.5 cursor-pointer
          ${isActive 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}
          ${isSubItem ? 'pl-11 text-sm' : 'text-sm font-medium'}
        `}
      >
        <Icon 
          size={isSubItem ? 16 : 18} 
          className={isActive ? 'text-blue-600' : 'text-gray-500'} 
        />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border rounded-lg shadow-sm text-gray-600"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header with close button (mobile) */}
        <div className="p-5 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">
            {/* Your logo / app name here if needed */}
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">
            Menu
          </div>

          <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />

          {/* Accounts section */}
          <div className="mt-2">
            <button
              onClick={() => toggleMenu('account')}
              className={`
                w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium
                ${openMenus.account ? 'text-blue-700' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center gap-3">
                <UserCircle size={18} className="text-gray-500" />
                <span>Accounts</span>
              </div>
              {openMenus.account ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openMenus.account && (
              <div className="mt-1 space-y-0.5">
                <NavItem icon={Users}    label="All Accounts"     id="accounts"  isSubItem />
                <NavItem icon={FileText} label="Analytics Report" id="reports"  isSubItem />
                <NavItem icon={Upload}   label="Import Data"      id="upload"   isSubItem />
              </div>
            )}
          </div>
        </div>

        {/* Bottom area (can add logout etc later) */}
        <div className="mt-auto border-t border-gray-100 p-4">
          {/* empty for now */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;