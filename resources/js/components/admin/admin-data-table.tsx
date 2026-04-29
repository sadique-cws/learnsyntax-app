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
                    // Handle nested objects if necessary (simple one level)
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
        <div className="space-y-6">
            {(title || onAdd) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                        {title && <h1 className="text-[20px] font-semibold text-foreground leading-tight tracking-tight">{title}</h1>}
                        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    {onAdd && (
                        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 font-medium px-6 shadow-md shadow-primary/20 rounded-md text-xs">
                            {addLabel}
                        </Button>
                    )}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-background p-4 rounded-lg border border-border/50 shadow-sm">
                <div className="relative w-full lg:w-80 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                    <Input 
                        placeholder={searchPlaceholder} 
                        className="pl-10 h-10 rounded-md border-border bg-muted/20 text-xs font-medium focus-visible:bg-background transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {dateFilterKey && (
                    <div className="flex items-center gap-3 p-1 px-4 rounded-md border border-border/50 bg-muted/10 hover:border-primary/20 transition-colors group/range">
                        <Calendar 
                            className="size-3.5 text-muted-foreground group-hover/range:text-primary transition-colors cursor-pointer" 
                            onClick={() => (document.getElementById('date-filter-start') as HTMLInputElement)?.showPicker?.()}
                        />
                        <div className="flex items-center gap-2">
                            <Input 
                                id="date-filter-start"
                                type="date" 
                                className="h-8 border-none bg-transparent text-[11px] font-semibold focus-visible:ring-0 w-[100px] p-0 cursor-pointer"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                            <span className="text-[10px] font-bold text-muted-foreground/40 lowercase">to</span>
                            <Input 
                                type="date" 
                                className="h-8 border-none bg-transparent text-[11px] font-semibold focus-visible:ring-0 w-[100px] p-0 cursor-pointer"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                            />
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <button 
                                onClick={() => setDateRange({ start: '', end: '' })}
                                className="p-1 hover:bg-background rounded-full transition-colors"
                            >
                                <X className="size-3 text-muted-foreground hover:text-destructive" />
                            </button>
                        )}
                    </div>
                )}
                
                <div className="flex-1" />

                {filterableColumns.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={cn(
                                "rounded-md h-10 px-4 font-medium text-xs border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors",
                                hasActiveFilters && "border-primary/30 text-primary bg-primary/5"
                            )}>
                                <Filter className="size-4 mr-2" />
                                Filter
                                {hasActiveFilters && (
                                    <span className="ml-2 bg-primary text-white size-4 rounded-full flex items-center justify-center text-[9px]">
                                        {Object.values(activeFilters).flat().length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-md border-border shadow-lg">
                            <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground/60 tracking-wider uppercase px-2 py-2">Filter By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {filterableColumns.map(filter => (
                                <div key={filter.key}>
                                    <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground/40 px-2 py-1.5 uppercase tracking-widest">{filter.label}</DropdownMenuLabel>
                                    {filter.options.map(option => (
                                        <DropdownMenuCheckboxItem
                                            key={String(option.value)}
                                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                                            onCheckedChange={() => toggleFilter(filter.key, option.value)}
                                            className="text-xs font-medium py-2"
                                        >
                                            {option.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                </div>
                            ))}
                            {hasActiveFilters && (
                                <DropdownMenuItem 
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-destructive focus:text-destructive focus:bg-destructive/5 justify-center py-2"
                                >
                                    Clear All Filters
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Filter Tags */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, values]) => {
                        const filterDef = filterableColumns.find(f => f.key === key);
                        return values.map(val => {
                            const option = filterDef?.options.find(o => o.value === val);
                            return (
                                <div key={`${key}-${val}`} className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-[10px] font-bold text-primary tracking-tight">
                                    <span className="opacity-60">{filterDef?.label}:</span> {option?.label || val}
                                    <X className="size-3 cursor-pointer hover:text-destructive transition-colors ml-1" onClick={() => toggleFilter(key, val)} />
                                </div>
                            );
                        });
                    })}
                </div>
            )}

            <Card className="border-border/50 shadow-sm overflow-hidden bg-background">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                {columns.map((col) => (
                                    <th 
                                        key={String(col.key)}
                                        className={cn(
                                            "px-5 py-4 text-[11px] font-bold tracking-wider uppercase text-muted-foreground/60 transition-colors",
                                            col.sortable && "cursor-pointer hover:bg-muted/50",
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
                                {actions && <th className="px-5 py-4 text-[11px] font-bold tracking-wider uppercase text-right text-muted-foreground/60">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredAndSortedData.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/10 transition-colors group">
                                    {columns.map((col) => (
                                        <td 
                                            key={String(col.key)} 
                                            className={cn(
                                                "px-5 py-4 text-[13px] font-medium text-foreground/80",
                                                col.align === 'right' && "text-right",
                                                col.align === 'center' && "text-center"
                                            )}
                                        >
                                            {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-5 py-4 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredAndSortedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-5 py-20 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="size-8 text-muted-foreground/20" />
                                            <div className="text-xs font-semibold opacity-60 uppercase tracking-widest">No matching records found</div>
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
