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
                        "size-8 rounded-sm flex items-center justify-center font-black text-[9px] shrink-0 border uppercase tracking-tighter",
                        user.is_admin ? "bg-primary/10 text-primary border-primary/20" : 
                        user.is_teacher ? "bg-accent/10 text-accent border-accent/20" : 
                        "bg-slate-50 text-slate-400 border-slate-200"
                    )}>
                        {user.name.substring(0, 2)}
                    </div>
                    <div>
                        <div className="font-black text-[12px] text-slate-900 leading-tight uppercase tracking-tight">{user.name}</div>
                        <div className="text-[9px] text-muted-foreground font-bold mt-0.5 lowercase italic opacity-60">{user.email}</div>
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
                        <div className="px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary text-[8px] font-black uppercase tracking-[0.15em] border border-primary/10 flex items-center gap-1">
                            <Shield className="size-2.5" /> root
                        </div>
                    )}
                    {user.is_teacher && (
                        <div className="px-1.5 py-0.5 rounded-sm bg-accent/5 text-accent text-[8px] font-black uppercase tracking-[0.15em] border border-accent/10 flex items-center gap-1">
                            <GraduationCap className="size-2.5" /> faculty
                        </div>
                    )}
                    {!user.is_admin && !user.is_teacher && (
                        <div className="px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-300 text-[8px] font-black uppercase tracking-[0.15em] border border-slate-100">
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
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            )
        }
    ];

    return (
        <>
            <Head title="Identity Management" />
            
            <div className="w-full p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-1.5">
                            <Shield className="size-3" /> Core Registry
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Identity Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Synchronizing global authentication states and role-based protocols.</p>
                    </div>
                </div>

                <div className="bg-background rounded-sm border border-border shadow-none overflow-hidden">
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
                                        className="h-7 px-2.5 rounded-sm font-black text-[8px] uppercase tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 shadow-none"
                                        onClick={() => handlePromote(user)}
                                    >
                                        <UserPlus className="size-2.5 mr-1" /> Initialize Faculty
                                    </Button>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm text-slate-300 hover:bg-slate-50 hover:text-primary shadow-none"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm text-slate-200 hover:bg-rose-50 hover:text-rose-600 shadow-none"
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
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="p-4 bg-muted/20 border-b border-border">
                        <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-600">
                            <Edit2 className="size-4 text-primary" /> Modify Identity
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="p-4 space-y-4 bg-background">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Profile Name</Label>
                                <Input 
                                    className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Protocol</Label>
                                <Input 
                                    className="h-9 rounded-sm border-border bg-muted/10 font-bold text-xs shadow-none"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-primary/5 rounded-sm border border-primary/10">
                                <Checkbox 
                                    id="is_admin"
                                    checked={editForm.data.is_admin}
                                    onCheckedChange={(checked) => editForm.setData('is_admin', !!checked)}
                                    className="rounded-sm border-primary/30"
                                />
                                <Label htmlFor="is_admin" className="text-[9px] font-black uppercase tracking-widest text-primary cursor-pointer flex items-center gap-1.5">
                                    <ShieldAlert className="size-3" /> Elevate to Administrative Root
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border">Abort</Button>
                            <Button type="submit" disabled={editForm.processing} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Commit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promote to Teacher Modal */}
            <Dialog open={isPromoteModalOpen} onOpenChange={setIsPromoteModalOpen}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="p-4 bg-primary/5 border-b border-primary/10">
                        <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                            <GraduationCap className="size-4" /> Initialize Faculty
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPromote} className="p-4 space-y-4 bg-background">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 p-2.5 bg-muted/10 rounded-sm border border-border">
                                <div className="size-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/10">
                                    {selectedUser?.name.substring(0, 2)}
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-[12px] uppercase tracking-tight">{selectedUser?.name}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5 lowercase italic">{selectedUser?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Institutional Yield Rate (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="h-10 pl-10 rounded-sm border-border bg-muted/10 font-black text-sm shadow-none"
                                        value={promoteForm.data.commission_percent}
                                        onChange={e => promoteForm.setData('commission_percent', parseInt(e.target.value))}
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm">%</div>
                                </div>
                                <p className="text-[9px] font-bold text-muted-foreground/40 italic px-1 leading-relaxed uppercase tracking-wider">Defines the faculty share of generated revenue protocols.</p>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPromoteModalOpen(false)} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] border border-border">Discard</Button>
                            <Button type="submit" disabled={promoteForm.processing} className="flex-1 h-9 rounded-sm font-black uppercase tracking-widest text-[9px] bg-primary text-white hover:bg-primary/90 shadow-none">Verify & Authorize</Button>
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
