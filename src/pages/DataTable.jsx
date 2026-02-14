import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccount } from '../features/accounts/accountsSlice';
import { 
  useReactTable, getCoreRowModel, getFilteredRowModel, 
  getPaginationRowModel, getSortedRowModel, flexRender 
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import AccountForm from './AccountForm';
import { 
  Search, ChevronLeft, ChevronRight, 
  MoreHorizontal, Edit3, Trash2, Eye, Download,
  MoreVertical, SortAsc, SortDesc
} from 'lucide-react';

const DataTable = () => {
  const data = useSelector((state) => state.accounts.accounts);
  const dispatch = useDispatch();
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortMenu, setSortMenu] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentView, setCurrentView] = useState('list'); 
  const [editingAccount, setEditingAccount] = useState(null);

  const handleEdit = (account) => {
    setEditingAccount(account);
    setCurrentView('create');
    setActiveMenu(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      dispatch(deleteAccount(id));
      setActiveMenu(null);
    }
  };

  const downloadExcel = (rows, label) => {
    if (rows.length === 0) return alert("No data available to export");
    
    const exportData = rows.map(({ id, ...rest }) => ({
      "Account Name": rest.name,
      "Email Address": rest.email,
      "Phone Number": rest.phone,
      "Website": rest.website,
      "Industry": rest.industry,
      "Status": rest.status ? "Active" : "Inactive",
      "Remarks": rest.remark
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
    XLSX.writeFile(workbook, `Account_Report_${label}_${new Date().toLocaleDateString()}.xlsx`);
    setShowExportMenu(false);
  };

  const handleExportOption = (type) => {
    if (type === 'current') {
      const currentRows = table.getRowModel().rows.map(row => row.original);
      downloadExcel(currentRows, "Current_Page");
    } else if (type === 'all') {
      downloadExcel(data, "All_Records");
    } else if (type === 'custom') {
      const range = window.prompt("Enter range (e.g., 1-10 or 20-23):");
      if (!range) return;
      const [start, end] = range.split('-').map(num => parseInt(num.trim()));
      
      if (isNaN(start) || isNaN(end) || start < 1 || end > data.length || start > end) {
        alert(`Invalid range. Total records: ${data.length}`);
        return;
      }
      const customRows = data.slice(start - 1, end);
      downloadExcel(customRows, `Range_${start}-${end}`);
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'Account Name', 
      accessorKey: 'name',
      cell: info => <span className="font-medium">{info.getValue()}</span>
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Phone No.', accessorKey: 'phone' },
    { 
      header: 'Website', 
      accessorKey: 'website',
      cell: info => <span className="text-blue-600">{info.getValue() || '—'}</span>
    },
    { header: 'Industry', accessorKey: 'industry' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: info => {
        const isActive = info.getValue() === true;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={isActive ? 'text-green-700' : 'text-gray-600'}>
              {isActive ? 'Active' : 'Offline'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === row.id ? null : row.id);
            }}
            className="p-1 hover:bg-gray-100"
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>

          {activeMenu === row.id && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-300 z-50 min-w-[140px]">
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                <Eye size={14} className="inline mr-2" /> View
              </button>
              <button 
                onClick={() => handleEdit(row.original)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                <Edit3 size={14} className="inline mr-2" /> Edit
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button 
                onClick={() => handleDelete(row.original.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} className="inline mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      )
    }
  ], [activeMenu]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6" onClick={() => { setActiveMenu(null); setShowExportMenu(false); setSortMenu(null); }}>
      
      <div className="border-b">
        <div className="flex gap-6">
          <button 
            onClick={() => { setCurrentView('list'); setEditingAccount(null); }}
            className={`pb-2 text-sm font-medium border-b-2 ${currentView === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            All Accounts
          </button>
          <button 
            onClick={() => setCurrentView('create')}
            className={`pb-2 text-sm font-medium border-b-2 ${currentView === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            {editingAccount ? 'Edit Account' : 'Add New'}
          </button>
        </div>
      </div>

      {currentView === 'list' ? (
        <div className="space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowExportMenu(!showExportMenu); 
                }}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 hover:bg-gray-900"
              >
                <Download size={16} /> Export
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-300 z-50 min-w-[180px]">
                  <button 
                    onClick={() => handleExportOption('current')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Current page ({table.getRowModel().rows.length})
                  </button>
                  <button 
                    onClick={() => handleExportOption('all')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    All records ({data.length})
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    onClick={() => handleExportOption('custom')}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50"
                  >
                    Custom range...
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-gray-100 border-b">
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-600">
                          <div className="flex items-center justify-between">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            
                            {header.column.getCanSort() && (
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSortMenu(sortMenu === header.id ? null : header.id);
                                  }}
                                  className="p-1 hover:bg-gray-200"
                                >
                                  <MoreVertical size={14} className="text-gray-500" />
                                </button>

                                {sortMenu === header.id && (
                                  <div className="absolute right-0 mt-1 bg-white border border-gray-300 z-50 min-w-[140px]">
                                    <button 
                                      onClick={() => { header.column.toggleSorting(false); setSortMenu(null); }}
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                      <SortAsc size={14} className="inline mr-2" /> Ascending
                                    </button>
                                    <button 
                                      onClick={() => { header.column.toggleSorting(true); setSortMenu(null); }}
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                      <SortDesc size={14} className="inline mr-2" /> Descending
                                    </button>
                                    {header.column.getIsSorted() && (
                                      <>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button 
                                          onClick={() => { header.column.clearSorting(); setSortMenu(null); }}
                                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                          Clear sort
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-3 bg-gray-50 border-t">
              <div className="text-sm text-gray-600">
                Showing {table.getRowModel().rows.length} of {data.length}
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
                  {[...Array(table.getPageCount())].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => table.setPageIndex(i)}
                      className={`px-3 py-1 text-sm ${
                        table.getState().pagination.pageIndex === i 
                          ? 'bg-blue-600 text-white' 
                          : 'border hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="border border-gray-200">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  {editingAccount ? 'Edit Account' : 'New Account'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingAccount ? 'Update information' : 'Enter new account details'}
                </p>
              </div>
              {editingAccount && (
                <button 
                  onClick={() => {setEditingAccount(null); setCurrentView('list');}}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="p-6">
              <AccountForm 
                existingData={editingAccount} 
                onSuccess={() => {setCurrentView('list'); setEditingAccount(null);}} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;