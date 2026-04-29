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
                <div className="flex items-center gap-2.5 py-1">
                    <div className={cn(
                        "size-9 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 border uppercase tracking-tighter",
                        user.is_admin ? "bg-primary/10 text-primary border-primary/20" : 
                        user.is_teacher ? "bg-accent/10 text-accent border-accent/20" : 
                        "bg-slate-50 text-slate-400 border-slate-200"
                    )}>
                        {user.name.substring(0, 2)}
                    </div>
                    <div>
                        <div className="font-black text-[13px] text-slate-900 leading-tight uppercase tracking-tight">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold mt-0.5 lowercase italic opacity-60">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'roles',
            label: 'Access Protocols',
            render: (user) => (
                <div className="flex flex-wrap gap-1.5">
                    {user.is_admin && (
                        <div className="px-1.5 py-0.5 rounded bg-primary/5 text-primary text-[8px] font-black uppercase tracking-[0.15em] border border-primary/10 flex items-center gap-1">
                            <Shield className="size-2.5" /> root
                        </div>
                    )}
                    {user.is_teacher && (
                        <div className="px-1.5 py-0.5 rounded bg-accent/5 text-accent text-[8px] font-black uppercase tracking-[0.15em] border border-accent/10 flex items-center gap-1">
                            <GraduationCap className="size-2.5" /> faculty
                        </div>
                    )}
                    {!user.is_admin && !user.is_teacher && (
                        <div className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-300 text-[8px] font-black uppercase tracking-[0.15em] border border-slate-100">
                            subscriber
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
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            )
        }
    ];

    return (
        <>
            <Head title="Identity Management" />
            
            <div className="w-full p-4 lg:p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                            <Shield className="size-3" /> Core Registry
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Identity Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 italic">Synchronizing global authentication states and role-based protocols.</p>
                    </div>
                </div>

                <div className="bg-background rounded-xl border border-border shadow-none overflow-hidden">
                    <AdminDataTable 
                        title="Universal User Registry"
                        subtitle="Managing synchronized identities and role-based access protocols"
                        data={users}
                        columns={columns}
                        searchPlaceholder="Filter identity by metadata..."
                        actions={(user) => (
                            <div className="flex items-center justify-end gap-1.5">
                                {!user.is_teacher && !user.is_admin && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 px-2.5 rounded-lg font-black text-[8px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all shadow-none"
                                        onClick={() => handlePromote(user)}
                                    >
                                        <UserPlus className="size-2.5 mr-1" /> Initialize Faculty
                                    </Button>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-lg text-slate-300 hover:bg-slate-50 hover:text-primary transition-all"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-lg text-slate-200 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="p-5 bg-muted/20 border-b border-border">
                        <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">
                            <Edit2 className="size-4 text-primary" /> Modify Identity
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="p-5 space-y-4 bg-background">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Profile Name</Label>
                                <Input 
                                    className="h-10 rounded-lg border-border bg-muted/10 font-bold text-sm focus-visible:ring-primary/20 shadow-none"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Protocol</Label>
                                <Input 
                                    className="h-10 rounded-lg border-border bg-muted/10 font-bold text-sm focus-visible:ring-primary/20 shadow-none"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                <Checkbox 
                                    id="is_admin"
                                    checked={editForm.data.is_admin}
                                    onCheckedChange={(checked) => editForm.setData('is_admin', !!checked)}
                                    className="rounded border-primary/30"
                                />
                                <Label htmlFor="is_admin" className="text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer flex items-center gap-2">
                                    <ShieldAlert className="size-3.5" /> Elevate to Administrative Root
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-5 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-10 rounded-lg font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                            <Button type="submit" disabled={editForm.processing} className="flex-1 h-10 rounded-lg font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promote to Teacher Modal */}
            <Dialog open={isPromoteModalOpen} onOpenChange={setIsPromoteModalOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="p-5 bg-primary/5 border-b border-primary/10">
                        <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                            <GraduationCap className="size-5" /> Initialize Faculty
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPromote} className="p-5 space-y-5 bg-background">
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border">
                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase border border-primary/10">
                                    {selectedUser?.name.substring(0, 2)}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{selectedUser?.name}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5 lowercase italic">{selectedUser?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Institutional Yield Rate (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="h-12 pl-12 rounded-lg border-border bg-muted/10 font-black text-lg focus:bg-background transition-all shadow-none focus-visible:ring-primary/20"
                                        value={promoteForm.data.commission_percent}
                                        onChange={e => promoteForm.setData('commission_percent', parseInt(e.target.value))}
                                        required
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground/40 italic px-1 leading-relaxed uppercase tracking-wider">Defines the faculty share of generated revenue protocols.</p>
                            </div>
                        </div>
                        <DialogFooter className="pt-5 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPromoteModalOpen(false)} className="flex-1 h-11 rounded-lg font-black uppercase tracking-widest text-[9px] border border-border">Discard</Button>
                            <Button type="submit" disabled={promoteForm.processing} className="flex-1 h-11 rounded-lg font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Verify & Authorize</Button>
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
