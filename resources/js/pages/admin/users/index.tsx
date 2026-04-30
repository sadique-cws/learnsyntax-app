import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Shield, GraduationCap, Trash2, Edit2, UserPlus, ShieldAlert, Users, Flame, Trophy } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
            label: 'User',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        "size-8 rounded-sm flex items-center justify-center text-xs font-semibold shrink-0 border",
                        user.is_admin ? "bg-violet-50 text-violet-600 border-violet-100" : 
                        user.is_teacher ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        "bg-slate-50 text-slate-500 border-slate-100"
                    )}>
                        {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'roles',
            label: 'Role',
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.is_admin && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-violet-50 text-violet-600 text-[10px] font-medium border border-violet-100">
                            <Shield className="size-2.5" /> Admin
                        </span>
                    )}
                    {user.is_teacher && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 text-[10px] font-medium border border-blue-100">
                            <GraduationCap className="size-2.5" /> Teacher
                        </span>
                    )}
                    {!user.is_admin && !user.is_teacher && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-slate-50 text-slate-400 text-[10px] font-medium border border-slate-100">
                            Student
                        </span>
                    )}
                </div>
            )
        },
        {
            key: 'streak',
            label: 'Streak',
            sortable: true,
            render: (user) => (
                <div className="flex items-center gap-1.5">
                    {user.latest_login_streak ? (
                        <>
                            <Flame className="size-3 text-orange-500" />
                            <span className="text-xs font-semibold text-orange-600 tabular-nums">
                                {user.latest_login_streak.current_streak}d
                            </span>
                        </>
                    ) : (
                        <span className="text-[10px] text-muted-foreground/30">—</span>
                    )}
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Joined',
            sortable: true,
            render: (user) => (
                <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            )
        }
    ];

    return (
        <>
            <Head title="Users" />
            
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Users</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">{users.length} registered users</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="h-8 rounded-sm text-xs font-medium border-border shadow-none">
                        <Link href="/admin/reports/top-strikers">
                            <Trophy className="size-3.5 mr-1.5 text-orange-500" /> Top Strikers
                        </Link>
                    </Button>
                </div>

                <div className="rounded-sm border border-border overflow-hidden">
                    <AdminDataTable 
                        title="All Users"
                        data={users}
                        columns={columns}
                        searchPlaceholder="Search by name or email..."
                        actions={(user) => (
                            <div className="flex items-center justify-end gap-1">
                                {!user.is_teacher && !user.is_admin && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 px-2 rounded-sm text-xs font-medium text-primary hover:bg-primary/5"
                                        onClick={() => handlePromote(user)}
                                    >
                                        <UserPlus className="size-3 mr-1" /> Make Teacher
                                    </Button>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Edit2 className="size-3" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-7 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5"
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
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <Edit2 className="size-4 text-muted-foreground" /> Edit User
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="p-4 space-y-4">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                                <Input 
                                    className="h-9 rounded-sm border-border text-sm shadow-none"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                                <Input 
                                    className="h-9 rounded-sm border-border text-sm shadow-none"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-muted/5 rounded-sm border border-border">
                                <Checkbox 
                                    id="is_admin"
                                    checked={editForm.data.is_admin}
                                    onCheckedChange={(checked) => editForm.setData('is_admin', !!checked)}
                                    className="rounded-sm"
                                />
                                <Label htmlFor="is_admin" className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
                                    <ShieldAlert className="size-3 text-muted-foreground" /> Grant admin privileges
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={editForm.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promote to Teacher Modal */}
            <Dialog open={isPromoteModalOpen} onOpenChange={setIsPromoteModalOpen}>
                <DialogContent className="max-w-md rounded-sm p-0 overflow-hidden border border-border shadow-none">
                    <DialogHeader className="px-4 py-3 border-b border-border">
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                            <GraduationCap className="size-4 text-muted-foreground" /> Promote to Teacher
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPromote} className="p-4 space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 p-2.5 bg-muted/5 rounded-sm border border-border">
                                <div className="size-8 rounded-sm bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-semibold border border-blue-100">
                                    {selectedUser?.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">{selectedUser?.name}</div>
                                    <div className="text-xs text-muted-foreground">{selectedUser?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Commission Rate (%)</Label>
                                <div className="relative">
                                    <Input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="h-9 pl-8 rounded-sm border-border text-sm shadow-none"
                                        value={promoteForm.data.commission_percent}
                                        onChange={e => promoteForm.setData('commission_percent', parseInt(e.target.value))}
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Percentage of revenue shared with the teacher.</p>
                            </div>
                        </div>
                        <DialogFooter className="pt-3 border-t border-border flex flex-row gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsPromoteModalOpen(false)} className="flex-1 h-9 rounded-sm text-xs shadow-none">Cancel</Button>
                            <Button type="submit" disabled={promoteForm.processing} className="flex-1 h-9 rounded-sm text-xs shadow-none">Confirm Promotion</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminUserIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Users', href: '/admin/users' }]}>
        {page}
    </AppLayout>
);
