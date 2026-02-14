import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  MoreVertical,
  ArrowRight,
  Activity,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const accounts = useSelector((state) => state.accounts.accounts);

  const metrics = useMemo(() => {
    const total = accounts.length;
    const activeCount = accounts.filter(acc => acc.status === true).length;
    const inactiveCount = accounts.filter(acc => acc.status === false).length;
    const newThisMonth = accounts.slice(0, 5).length; 

    const activePercentage = total > 0 ? Math.round((activeCount / total) * 100) : 0;

    return [
      { 
        label: 'Total Accounts', 
        value: total, 
        icon: Users, 
        color: 'text-blue-600',
      },
      { 
        label: 'Active', 
        value: activeCount, 
        icon: CheckCircle, 
        color: 'text-green-600',
      },
      { 
        label: 'Inactive', 
        value: inactiveCount, 
        icon: AlertCircle, 
        color: 'text-red-600',
      },
      { 
        label: 'New Entries', 
        value: newThisMonth, 
        icon: UserPlus, 
        color: 'text-indigo-600',
      },
    ];
  }, [accounts]);

  const recentActivity = useMemo(() => {
    return accounts.slice(0, 5).map(acc => ({
      user: acc.name,
      action: acc.remark || 'Status updated',
      time: 'recent',
      initial: acc.name.charAt(0).toUpperCase(),
      color: acc.status ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
    }));
  }, [accounts]);

  return (
    <div className="space-y-8">
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div className={`p-3 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs text-gray-500">
                {stat.value > 0 ? 'active' : ''}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <h3 className="text-2xl font-medium mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fake chart area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Account Activity</h3>
              <p className="text-sm text-gray-500">Overview</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200">
                <Calendar size={18} />
              </button>
              <button className="p-2 border border-gray-200">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
          
          <div className="h-60 bg-gray-50 flex items-end justify-between px-8 py-6 gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 85, 100].map((height, i) => (
              <div 
                key={i} 
                style={{ height: `${height}%` }} 
                className={`w-full ${i % 2 === 0 ? 'bg-gray-300' : 'bg-blue-500'}`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-4 px-2 text-xs text-gray-500">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-blue-600" />
            <h3 className="text-lg font-medium">Recent Entries</h3>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center text-sm font-medium ${item.color}`}>
                  {item.initial}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{item.user}</p>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">{item.action}</p>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
          
          <button className="w-full mt-6 py-2 border border-gray-300 text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            View all <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="bg-gray-900 text-white p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium">Local Data Storage</h2>
            <p className="text-gray-400 mt-2">
              Currently managing {accounts.length} accounts in your browser storage.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;