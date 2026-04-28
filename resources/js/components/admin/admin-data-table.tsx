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
    X
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
    actions
}: AdminDataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, any[]>>({});
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

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

        // 3. Sort
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
    }, [data, search, activeFilters, sortConfig, searchKey]);

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
                        {title && <h1 className="text-2xl font-medium tracking-tight text-foreground">{title}</h1>}
                        {subtitle && <p className="text-muted-foreground text-xs font-medium tracking-tight mt-1">{subtitle}</p>}
                    </div>
                    {onAdd && (
                        <Button onClick={onAdd} className="rounded font-medium tracking-tight text-[11px] h-10 px-6">
                            {addLabel}
                        </Button>
                    )}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                        placeholder={searchPlaceholder} 
                        className="pl-10 h-10 rounded border-border bg-card text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {filterableColumns.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className={cn(
                                "rounded h-10 px-4 font-medium text-[11px] tracking-tight border-border bg-card",
                                hasActiveFilters && "border-primary text-primary"
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
                        <DropdownMenuContent align="end" className="w-56 rounded border-border">
                            <DropdownMenuLabel className="text-[11px] font-medium tracking-tight">Filter By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {filterableColumns.map(filter => (
                                <div key={filter.key}>
                                    <DropdownMenuLabel className="text-[10px] font-medium text-muted-foreground px-2 py-1.5">{filter.label}</DropdownMenuLabel>
                                    {filter.options.map(option => (
                                        <DropdownMenuCheckboxItem
                                            key={String(option.value)}
                                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                                            onCheckedChange={() => toggleFilter(filter.key, option.value)}
                                            className="text-xs font-medium"
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
                                    className="text-xs font-medium tracking-tight text-destructive justify-center"
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
                                <div key={`${key}-${val}`} className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-medium tracking-tight text-primary">
                                    {filterDef?.label}: {option?.label || val}
                                    <X className="size-3 cursor-pointer" onClick={() => toggleFilter(key, val)} />
                                </div>
                            );
                        });
                    })}
                </div>
            )}

            <div className="border border-border rounded bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                {columns.map((col) => (
                                    <th 
                                        key={String(col.key)}
                                        className={cn(
                                            "px-4 py-3 text-[11px] font-medium tracking-tight transition-colors text-muted-foreground",
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
                                {actions && <th className="px-4 py-3 text-[11px] font-medium tracking-tight text-right text-muted-foreground">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredAndSortedData.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/10 transition-colors group">
                                    {columns.map((col) => (
                                        <td 
                                            key={String(col.key)} 
                                            className={cn(
                                                "px-4 py-4 text-sm font-medium tracking-tight",
                                                col.align === 'right' && "text-right",
                                                col.align === 'center' && "text-center"
                                            )}
                                        >
                                            {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-4 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredAndSortedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">
                                        <div className="text-xs font-medium tracking-tight opacity-50">No matching records found</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
