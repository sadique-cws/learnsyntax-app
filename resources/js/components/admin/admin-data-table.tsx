import { useState, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Search, 
    Filter, 
    ArrowUpDown, 
    ArrowUp, 
    ArrowDown,
    X,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
    key: string;
    label: string;
    options: { label: string; value: any }[];
}

interface AdminDataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    filterableColumns?: FilterOption[];
    searchPlaceholder?: string;
    searchKey?: keyof T | string;
    onAdd?: () => void;
    addLabel?: string;
    title?: string;
    subtitle?: string;
    actions?: (item: T) => ReactNode;
    dateFilterKey?: string;
}

export function AdminDataTable<T extends { id: number | string }>({ 
    data, 
    columns, 
    filterableColumns = [],
    searchPlaceholder = "Search records...",
    searchKey,
    onAdd,
    addLabel = "Add New",
    title,
    subtitle,
    actions,
    dateFilterKey
}: AdminDataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, any[]>>({});
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleFilter = (columnKey: string, value: any) => {
        setActiveFilters(prev => {
            const current = prev[columnKey] || [];
            const updated = current.includes(value) 
                ? current.filter(v => v !== value) 
                : [...current, value];
            
            const next = { ...prev, [columnKey]: updated };
            if (updated.length === 0) delete next[columnKey];
            return next;
        });
    };

    const clearFilters = () => setActiveFilters({});

    const filteredAndSortedData = useMemo(() => {
        let items = [...data];
        
        // 1. Search
        if (search) {
            const lowerSearch = search.toLowerCase();
            items = items.filter(item => {
                if (searchKey) {
                    const value = (item as any)[searchKey];
                    return String(value ?? '').toLowerCase().includes(lowerSearch);
                }
                
                return Object.values(item as any).some(val => {
                    if (val === null || val === undefined) return false;
                    if (typeof val === 'object' && !Array.isArray(val)) {
                        return Object.values(val).some(nestedVal => 
                            String(nestedVal ?? '').toLowerCase().includes(lowerSearch)
                        );
                    }
                    return String(val).toLowerCase().includes(lowerSearch);
                });
            });
        }

        // 2. Filters
        Object.entries(activeFilters).forEach(([key, values]) => {
            if (values.length > 0) {
                items = items.filter(item => {
                    const val = (item as any)[key];
                    return values.includes(val);
                });
            }
        });

        // 3. Date Range
        if (dateFilterKey && (dateRange.start || dateRange.end)) {
            items = items.filter(item => {
                const itemDate = new Date((item as any)[dateFilterKey]);
                if (dateRange.start && itemDate < new Date(dateRange.start)) return false;
                if (dateRange.end && itemDate > new Date(dateRange.end)) return false;
                return true;
            });
        }

        // 4. Sort
        if (sortConfig.key && sortConfig.direction) {
            items.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return items;
    }, [data, search, activeFilters, sortConfig, searchKey, dateRange, dateFilterKey]);

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="ml-1 size-3 opacity-20" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 size-3 text-foreground" /> : <ArrowDown className="ml-1 size-3 text-foreground" />;
    };

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {title && (
                        <div className="hidden md:flex items-center gap-2 pr-3 mr-3 border-r border-border shrink-0">
                            <h2 className="text-xs font-semibold text-foreground whitespace-nowrap">{title}</h2>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{filteredAndSortedData.length}</span>
                        </div>
                    )}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/40" />
                        <Input 
                            placeholder={searchPlaceholder} 
                            className="pl-8 h-7 text-xs border border-border bg-background rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {dateFilterKey && (
                        <div className="flex items-center gap-1.5 px-2 h-7 rounded-sm border border-border bg-background text-[10px]">
                            <Calendar className="size-3 text-muted-foreground/40 shrink-0" />
                            <Input 
                                id="date-filter-start"
                                type="date" 
                                className="h-5 border-none bg-transparent text-[10px] font-medium focus-visible:ring-0 w-[100px] p-0 appearance-none"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                            <span className="text-muted-foreground/30 shrink-0">–</span>
                            <Input 
                                type="date" 
                                className="h-5 border-none bg-transparent text-[10px] font-medium focus-visible:ring-0 w-[100px] p-0 appearance-none"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                            {(dateRange.start || dateRange.end) && (
                                <button onClick={() => setDateRange({ start: '', end: '' })} className="p-0.5 hover:bg-muted rounded-sm shrink-0">
                                    <X className="size-2.5 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </div>
                    )}

                    {filterableColumns.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className={cn(
                                    "h-7 px-2 text-xs font-medium gap-1",
                                    hasActiveFilters && "text-primary"
                                )}>
                                    <Filter className="size-3" />
                                    Filter
                                    {hasActiveFilters && (
                                        <span className="bg-primary text-white text-[9px] size-4 rounded-full flex items-center justify-center font-bold leading-none">
                                            {Object.values(activeFilters).flat().length}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-sm border-border p-1 shadow-md">
                                {filterableColumns.map(filter => (
                                    <div key={filter.key}>
                                        <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground px-2 py-1">{filter.label}</DropdownMenuLabel>
                                        {filter.options.map(option => (
                                            <DropdownMenuCheckboxItem
                                                key={String(option.value)}
                                                checked={(activeFilters[filter.key] || []).includes(option.value)}
                                                onCheckedChange={() => toggleFilter(filter.key, option.value)}
                                                className="text-xs py-1 px-2 rounded-sm"
                                            >
                                                {option.label}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                        <DropdownMenuSeparator className="my-0.5" />
                                    </div>
                                ))}
                                {hasActiveFilters && (
                                    <DropdownMenuItem 
                                        onClick={clearFilters}
                                        className="text-xs text-destructive justify-center py-1 rounded-sm font-medium"
                                    >
                                        Clear all
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {onAdd && (
                        <Button onClick={onAdd} size="sm" className="h-7 px-3 text-xs font-medium rounded-sm">
                            {addLabel}
                        </Button>
                    )}
                </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-1 px-3 py-1.5 border-b border-border bg-muted/5">
                    {Object.entries(activeFilters).map(([key, values]) => {
                        const filterDef = filterableColumns.find(f => f.key === key);
                        return values.map(val => {
                            const option = filterDef?.options.find(o => o.value === val);
                            return (
                                <div key={`${key}-${val}`} className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/5 border border-primary/10 rounded-sm text-[10px] font-medium text-primary">
                                    {option?.label || val}
                                    <X className="size-2.5 cursor-pointer hover:text-destructive" onClick={() => toggleFilter(key, val)} />
                                </div>
                            );
                        });
                    })}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {columns.map((col) => (
                                <th 
                                    key={String(col.key)}
                                    className={cn(
                                        "px-3 py-2 text-[11px] font-semibold text-muted-foreground select-none",
                                        col.sortable && "cursor-pointer hover:text-foreground",
                                        col.align === 'right' && "text-right",
                                        col.align === 'center' && "text-center"
                                    )}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className={cn(
                                        "flex items-center",
                                        col.align === 'right' && "justify-end",
                                        col.align === 'center' && "justify-center"
                                    )}>
                                        {col.label}
                                        {col.sortable && <SortIcon column={String(col.key)} />}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-3 py-2 text-[11px] font-semibold text-right text-muted-foreground w-px whitespace-nowrap"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAndSortedData.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                                {columns.map((col) => (
                                    <td 
                                        key={String(col.key)} 
                                        className={cn(
                                            "px-3 py-2 text-sm text-foreground",
                                            col.align === 'right' && "text-right",
                                            col.align === 'center' && "text-center"
                                        )}
                                    >
                                        {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-3 py-2 text-right">
                                        {actions(item)}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filteredAndSortedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Search className="size-5 text-muted-foreground/20" />
                                        <span className="text-xs text-muted-foreground/50">No results found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-border bg-muted/5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{filteredAndSortedData.length} of {data.length} records</span>
            </div>
        </div>
    );
}
