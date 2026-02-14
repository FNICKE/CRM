import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { 
  FilePieChart, 
  Download, 
  Filter, 
  FileText, 
  Printer, 
  ArrowUpRight,
  Database,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react';

const Report = () => {
  // 1. Pull live data from Redux
  const accounts = useSelector((state) => state.accounts.accounts);

  // 2. Calculate dynamic metrics based on live data
  const reportMetrics = useMemo(() => {
    const total = accounts.length;
    // Assuming 'Active Projects' are accounts with status: true
    const active = accounts.filter(acc => acc.status === true).length;
    // Assuming 'Pending Audits' are accounts with specific remarks or status: false
    const pending = accounts.filter(acc => acc.status === false).length;

    return [
      { label: 'Total Accounts', value: total.toLocaleString(), change: '+live', icon: Users, color: 'text-blue-600' },
      { label: 'Active Projects', value: active.toLocaleString(), change: '+live', icon: Database, color: 'text-indigo-600' },
      { label: 'Pending Audits', value: pending.toLocaleString(), change: 'Check', icon: FileText, color: 'text-gray-600' },
    ];
  }, [accounts]);

  // 3. Calculate dynamic Industry Distribution
  const industryData = useMemo(() => {
    const counts = accounts.reduce((acc, curr) => {
      const ind = curr.industry === 'n/a' || !curr.industry ? 'Other' : curr.industry;
      acc[ind] = (acc[ind] || 0) + 1;
      return acc;
    }, {});

    const sortedIndustries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by highest count
      .slice(0, 4); // Take top 4 for the UI

    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-gray-800', 'bg-gray-400'];
    const total = accounts.length;

    return sortedIndustries.map(([name, count], index) => ({
      name,
      count,
      color: colors[index] || 'bg-slate-400',
      width: total > 0 ? `w-[${Math.round((count / total) * 100)}%]` : 'w-[0%]'
    }));
  }, [accounts]);

  // 4. Update Goal Progress based on Active status percentage
  const goalPercentage = useMemo(() => {
    if (accounts.length === 0) return 0;
    const active = accounts.filter(acc => acc.status === true).length;
    return Math.round((active / accounts.length) * 100);
  }, [accounts]);

  const handleExportReport = () => {
    const overviewSheet = reportMetrics.map(m => ({
      Metric: m.label,
      Value: m.value,
      Growth: m.change
    }));

    const industrySheet = industryData.map(i => ({
      Industry: i.name,
      Account_Count: i.count
    }));

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(overviewSheet);
    const ws2 = XLSX.utils.json_to_sheet(industrySheet);

    XLSX.utils.book_append_sheet(wb, ws1, "Executive Summary");
    XLSX.utils.book_append_sheet(wb, ws2, "Industry Breakdown");

    XLSX.writeFile(wb, `CRM_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center">
              <FilePieChart size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium">Analytics Report</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} />
                <span>Q1 2026</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
            <button 
              onClick={handleExportReport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-800 text-white px-5 py-2 text-sm hover:bg-gray-900"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reportMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <h3 className="text-3xl font-medium mt-1">{metric.value}</h3>
              </div>
              <div className={`p-3 ${metric.color}`}>
                <metric.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className={metric.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'}>
                {metric.change}
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry breakdown */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Industry Distribution</h3>
            <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View all <ExternalLink size={14} />
            </button>
          </div>
          <div className="space-y-5">
            {industryData.length > 0 ? industryData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span className="text-gray-600">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100">
                  <div className={`h-full ${item.color}`} style={{ width: item.width.replace('w-[', '').replace(']', '') }}></div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-10">No industry data available</p>
            )}
          </div>
        </div>

        {/* Goal progress (simplified) */}
        <div className="bg-gray-900 text-white p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium">Quarterly Goal</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Current progress shows we are ahead of target.
              </p>
            </div>

            <div>
              <div className="text-6xl font-medium text-blue-400">{goalPercentage}%</div>
              <div className="text-gray-400 mt-1">Target reached</div>
            </div>

            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700">
                Full Report
              </button>
              <button className="border border-gray-600 text-white px-6 py-2 text-sm hover:bg-gray-800">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;