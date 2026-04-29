import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, Shield, GraduationCap, Trash2, Edit2, ChevronRight, UserPlus, Mail, ShieldAlert } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminUserIndex({ users }: { users: any[] }) {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

    const editForm = useForm({
        name: '',
        email: '',
        is_admin: false,
    });

    const promoteForm = useForm({
        user_id: '',
        commission_percent: 50,
    });

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            is_admin: !!user.is_admin,
        });
        setIsEditModalOpen(true);
    };

    const handlePromote = (user: any) => {
        setSelectedUser(user);
        promoteForm.setData('user_id', user.id.toString());
        setIsPromoteModalOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const submitPromote = (e: React.FormEvent) => {
        e.preventDefault();
        promoteForm.post('/admin/teachers', {
            onSuccess: () => {
                setIsPromoteModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            useForm().delete(`/admin/users/${id}`);
        }
    };

    const columns: Column<any>[] = [
        {
            key: 'name',
            label: 'Identity Profile',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-3 py-1">
                    <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border",
                        user.is_admin ? "bg-purple-50 text-purple-600 border-purple-100" : 
                        user.is_teacher ? "bg-indigo-50 text-indigo-600 border-indigo-100" : 
                        "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                        {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-[13px] text-slate-900 leading-tight">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 lowercase">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'roles',
            label: 'Authentication Roles',
            render: (user) => (
                <div className="flex flex-wrap gap-2">
                    {user.is_admin && (
                        <div className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-wider border border-purple-100 flex items-center gap-1.5">
                            <Shield className="size-3" /> Admin
                        </div>
                    )}
                    {user.is_teacher && (
                        <div className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100 flex items-center gap-1.5">
                            <GraduationCap className="size-3" /> Faculty
                        </div>
                    )}
                    {!user.is_admin && !user.is_teacher && (
                        <div className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider border border-slate-100">
                            Subscriber
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Registry Date',
            sortable: true,
            render: (user) => (
                <span className="text-[12px] font-bold text-slate-500">{new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            )
        }
    ];

    return (
        <>
            <Head title="Manage Users" />
            
            <div className="w-full p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Identity Management</h1>
                        <p className="text-slate-500 text-xs font-bold mt-1">Audit and manage global user authentication states</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <AdminDataTable 
                        title="Universal User Registry"
                        subtitle="Managing synchronized identities and role-based access protocols"
                        data={users}
                        columns={columns}
                        searchPlaceholder="Filter users by identity or protocol..."
                        actions={(user) => (
                            <div className="flex items-center justify-end gap-2">
                                {!user.is_teacher && !user.is_admin && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-wider border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                                        onClick={() => handlePromote(user)}
                                    >
                                        <UserPlus className="size-3 mr-1.5" /> Assign Faculty
                                    </Button>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Edit2 className="size-3.5" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <Edit2 className="size-5 text-indigo-600" /> Modify Identity
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="p-6 space-y-4 bg-white">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                <Input 
                                    className="h-11 rounded-xl border-slate-200 font-bold text-sm"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Protocol</Label>
                                <Input 
                                    className="h-11 rounded-xl border-slate-200 font-bold text-sm"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <Checkbox 
                                    id="is_admin"
                                    checked={editForm.data.is_admin}
                                    onCheckedChange={(checked) => editForm.setData('is_admin', !!checked)}
                                />
                                <Label htmlFor="is_admin" className="text-[11px] font-black uppercase tracking-wider text-purple-700 cursor-pointer flex items-center gap-2">
                                    <ShieldAlert className="size-4" /> Grant Administrative Authority
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-6 border-t border-slate-100 flex flex-row gap-3">
                            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px]">Abort</Button>
                            <Button type="submit" disabled={editForm.processing} className="flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-700">Synchronize</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promote to Teacher Modal */}
            <Dialog open={isPromoteModalOpen} onOpenChange={setIsPromoteModalOpen}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-indigo-50 border-b border-indigo-100">
                        <DialogTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-indigo-700">
                            <GraduationCap className="size-6" /> Promote to Faculty
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPromote} className="p-6 space-y-6 bg-white">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="size-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {selectedUser?.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{selectedUser?.name}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{selectedUser?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Institutional Commission Rate (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="h-14 pl-14 rounded-2xl border-slate-200 bg-slate-50 font-black text-lg focus:bg-white transition-all shadow-inner"
                                        value={promoteForm.data.commission_percent}
                                        onChange={e => promoteForm.setData('commission_percent', parseInt(e.target.value))}
                                        required
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">%</div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 italic px-1 leading-relaxed">This percentage defines the instructor's share of revenue generated from their assigned batches and courses.</p>
                            </div>
                        </div>
                        <DialogFooter className="pt-6 border-t border-slate-100 flex flex-row gap-3">
                            <Button type="button" variant="ghost" onClick={() => setIsPromoteModalOpen(false)} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                            <Button type="submit" disabled={promoteForm.processing} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">Grant Access</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminUserIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Manage Users', href: '/admin/users' }]}>
        {page}
    </AppLayout>
);
