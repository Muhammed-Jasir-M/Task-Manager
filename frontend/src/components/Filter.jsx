import React from 'react';
import { Filter as FilterIcon, X } from 'lucide-react';

const Filter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showStatus = true,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange
}) => {
  const hasActiveFilters = Boolean(
    filters.status || 
    filters.priority || 
    (dateFilter && dateFilter !== 'all') || 
    (sortBy && sortBy !== 'default')
  );

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-3.5 sm:p-4 mb-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Title & Icon */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FilterIcon className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Filters & Sorting
          </h3>
        </div>

        {/* Inline Controls Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-start md:justify-end">
          
          {/* Status Filter (optional) */}
          {showStatus && (
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          )}

          {/* Priority Filter */}
          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Date Filter */}
          {onDateFilterChange && (
            <select
              value={dateFilter || 'all'}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Due Dates</option>
              <option value="today">Due Today</option>
              <option value="this_week">Due This Week</option>
              <option value="overdue">Overdue Tasks</option>
            </select>
          )}

          {/* Sort By Due Date / Priority */}
          {onSortChange && (
            <select
              value={sortBy || 'default'}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="date_asc">Due Date: Earliest First</option>
              <option value="date_desc">Due Date: Latest First</option>
              <option value="priority_desc">Priority: High to Low</option>
            </select>
          )}

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onClearFilters();
                if (onDateFilterChange) onDateFilterChange('all');
                if (onSortChange) onSortChange('default');
              }}
              className="flex items-center space-x-1 text-xs font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200 ml-auto md:ml-0"
              title="Reset all filters"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Filter;