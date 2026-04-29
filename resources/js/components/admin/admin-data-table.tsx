import { useState, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Search, 
    Filter, 
    ArrowUpDown, 
    ArrowUp, 
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
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
import { Card } from "@/components/ui/card";

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
        if (sortConfig.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-3 w-3 text-primary" /> : <ArrowDown className="ml-2 h-3 w-3 text-primary" />;
    };

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className="space-y-3">
            {(title || onAdd) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                    <div>
                        {title && <h1 className="text-lg font-black text-slate-900 leading-none uppercase tracking-tight">{title}</h1>}
                        {subtitle && <p className="text-[10px] font-bold text-muted-foreground/50 mt-1 uppercase tracking-wider italic leading-none">{subtitle}</p>}
                    </div>
                    {onAdd && (
                        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-white h-8 font-black uppercase tracking-[0.2em] px-4 rounded-sm text-[10px] shadow-none">
                            {addLabel}
                        </Button>
                    )}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center bg-background p-2 rounded-sm border border-border">
                <div className="relative w-full lg:w-64 shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
                    <Input 
                        placeholder={searchPlaceholder} 
                        className="pl-8 h-8 rounded-sm border-border bg-muted/20 text-xs font-bold focus-visible:bg-background shadow-none placeholder:text-muted-foreground/40"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {dateFilterKey && (
                    <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-sm border border-border bg-muted/5 hover:border-primary/30 transition-all group/range">
                        <Calendar 
                            className="size-3 text-muted-foreground/60 group-hover/range:text-primary transition-colors cursor-pointer" 
                            onClick={() => (document.getElementById('date-filter-start') as HTMLInputElement)?.showPicker?.()}
                        />
                        <div className="flex items-center gap-1">
                            <Input 
                                id="date-filter-start"
                                type="date" 
                                className="h-6 border-none bg-transparent text-[10px] font-black focus-visible:ring-0 w-[90px] p-0 cursor-pointer uppercase"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                            <span className="text-[8px] font-black text-muted-foreground/30 uppercase">to</span>
                            <Input 
                                type="date" 
                                className="h-6 border-none bg-transparent text-[10px] font-black focus-visible:ring-0 w-[90px] p-0 cursor-pointer uppercase"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <button 
                                onClick={() => setDateRange({ start: '', end: '' })}
                                className="p-0.5 hover:bg-muted rounded-sm transition-colors"
                            >
                                <X className="size-3 text-muted-foreground hover:text-rose-500" />
                            </button>
                        )}
                    </div>
                )}
                
                <div className="flex-1" />

                {filterableColumns.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={cn(
                                "rounded-sm h-8 px-3 font-black text-[10px] uppercase tracking-widest border-border bg-muted/5 hover:bg-muted/10 shadow-none",
                                hasActiveFilters && "border-primary/50 text-primary bg-primary/5"
                            )}>
                                <Filter className="size-3 mr-1.5" />
                                Filter
                                {hasActiveFilters && (
                                    <span className="ml-1.5 bg-primary text-white size-3 rounded-sm flex items-center justify-center text-[8px]">
                                        {Object.values(activeFilters).flat().length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-sm border-border shadow-none p-1">
                            <DropdownMenuLabel className="text-[9px] font-black text-muted-foreground/40 tracking-[0.2em] uppercase px-2 py-1.5">Parameters</DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1" />
                            {filterableColumns.map(filter => (
                                <div key={filter.key}>
                                    <DropdownMenuLabel className="text-[8px] font-black text-slate-400 px-2 py-1 uppercase tracking-[0.1em]">{filter.label}</DropdownMenuLabel>
                                    {filter.options.map(option => (
                                        <DropdownMenuCheckboxItem
                                            key={String(option.value)}
                                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                                            onCheckedChange={() => toggleFilter(filter.key, option.value)}
                                            className="text-[10px] font-bold py-1.5 px-2 focus:bg-primary/5 focus:text-primary rounded-sm"
                                        >
                                            {option.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuSeparator className="my-1" />
                                </div>
                            ))}
                            {hasActiveFilters && (
                                <DropdownMenuItem 
                                    onClick={clearFilters}
                                    className="text-[9px] font-black text-rose-500 focus:text-rose-600 focus:bg-rose-50 justify-center py-1.5 uppercase tracking-widest rounded-sm"
                                >
                                    Reset
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(activeFilters).map(([key, values]) => {
                        const filterDef = filterableColumns.find(f => f.key === key);
                        return values.map(val => {
                            const option = filterDef?.options.find(o => o.value === val);
                            return (
                                <div key={`${key}-${val}`} className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-sm text-[9px] font-black text-primary uppercase tracking-widest">
                                    <span className="opacity-40">{filterDef?.label}:</span> {option?.label || val}
                                    <X className="size-2.5 cursor-pointer hover:text-rose-500 ml-1" onClick={() => toggleFilter(key, val)} />
                                </div>
                            );
                        });
                    })}
                </div>
            )}

            <Card className="border-border shadow-none overflow-hidden bg-card rounded-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                {columns.map((col) => (
                                    <th 
                                        key={String(col.key)}
                                        className={cn(
                                            "px-3 py-2 text-[9px] font-black tracking-[0.2em] uppercase text-muted-foreground/60 transition-colors",
                                            col.sortable && "cursor-pointer hover:bg-muted/50 hover:text-primary",
                                            col.align === 'right' && "text-right",
                                            col.align === 'center' && "text-center"
                                        )}
                                        onClick={() => col.sortable && handleSort(String(col.key))}
                                    >
                                        <div className={cn(
                                            "flex items-center gap-1.5",
                                            col.align === 'right' && "justify-end",
                                            col.align === 'center' && "justify-center"
                                        )}>
                                            {col.label}
                                            {col.sortable && <SortIcon column={String(col.key)} />}
                                        </div>
                                    </th>
                                ))}
                                {actions && <th className="px-3 py-2 text-[9px] font-black tracking-[0.2em] uppercase text-right text-muted-foreground/60">Cmd</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredAndSortedData.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/10 transition-colors group">
                                    {columns.map((col) => (
                                        <td 
                                            key={String(col.key)} 
                                            className={cn(
                                                "px-3 py-2 text-xs font-bold text-slate-700",
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
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-16 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="size-10 rounded-sm bg-muted/30 flex items-center justify-center border border-dashed border-border">
                                                <Search className="size-4 text-muted-foreground/30" />
                                            </div>
                                            <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] italic">Null_Result_Set</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
