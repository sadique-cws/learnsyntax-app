import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Landmark, FileText, Save, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function AdminSettings({ settings }: { settings: any }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        company_name: settings.company_name || '',
        company_address: settings.company_address || '',
        company_gstin: settings.company_gstin || '',
        company_state: settings.company_state || '',
        company_state_code: settings.company_state_code || '',
        company_email: settings.company_email || '',
        company_phone: settings.company_phone || '',
        bank_name: settings.bank_name || '',
        bank_account_no: settings.bank_account_no || '',
        bank_ifsc: settings.bank_ifsc || '',
        bank_branch: settings.bank_branch || '',
        declaration: settings.declaration || 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <>
            <Head title="Invoice Settings" />
            
            <div className="w-full p-4 lg:p-8 max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-medium tracking-tight">Invoice & Company Settings</h1>
                    <p className="text-muted-foreground text-xs font-medium tracking-tight mt-1">Configure your company profile, GST details, and bank information for professional tax invoicing.</p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Company Details */}
                        <Card className="border-border rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <Building2 className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-medium">Company Profile</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">General Information</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Entity Name</Label>
                                    <Input 
                                        className="h-11 rounded-xl border-border bg-card shadow-sm"
                                        value={data.company_name}
                                        onChange={e => setData('company_name', e.target.value)}
                                        placeholder="e.g. Learn Syntax Academy"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Registered Address</Label>
                                    <Textarea 
                                        className="min-h-[100px] rounded-xl border-border bg-card shadow-sm"
                                        value={data.company_address}
                                        onChange={e => setData('company_address', e.target.value)}
                                        placeholder="Full registered office address..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm"
                                            value={data.company_email}
                                            onChange={e => setData('company_email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm"
                                            value={data.company_phone}
                                            onChange={e => setData('company_phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tax & GST Details */}
                        <Card className="border-border rounded-2xl shadow-sm overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-600 border border-orange-500/10">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-medium">Tax Compliance</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">GST & State Configuration</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">GSTIN / UIN</Label>
                                    <Input 
                                        className="h-11 rounded-xl border-border bg-card shadow-sm font-mono uppercase"
                                        value={data.company_gstin}
                                        onChange={e => setData('company_gstin', e.target.value)}
                                        placeholder="29AA... (15 digits)"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">State Name</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm"
                                            value={data.company_state}
                                            onChange={e => setData('company_state', e.target.value)}
                                            placeholder="e.g. Karnataka"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">State Code</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm font-mono"
                                            value={data.company_state_code}
                                            onChange={e => setData('company_state_code', e.target.value)}
                                            placeholder="e.g. 29"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 mt-4 border-t border-dashed border-border/50">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Declaration</Label>
                                    <Textarea 
                                        className="min-h-[80px] rounded-xl border-border bg-card shadow-sm text-xs mt-2"
                                        value={data.declaration}
                                        onChange={e => setData('declaration', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bank Details */}
                        <Card className="border-border rounded-2xl shadow-sm overflow-hidden md:col-span-2">
                            <CardHeader className="bg-muted/30 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-600 border border-blue-500/10">
                                        <Landmark className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-medium">Bank Information</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest">For Payment Settlements</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bank Name</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm"
                                            value={data.bank_name}
                                            onChange={e => setData('bank_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm font-mono"
                                            value={data.bank_account_no}
                                            onChange={e => setData('bank_account_no', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">IFSC Code</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm font-mono uppercase"
                                            value={data.bank_ifsc}
                                            onChange={e => setData('bank_ifsc', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Branch</Label>
                                        <Input 
                                            className="h-11 rounded-xl border-border bg-card shadow-sm"
                                            value={data.bank_branch}
                                            onChange={e => setData('bank_branch', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        {recentlySuccessful && (
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm animate-in fade-in slide-in-from-right-4">
                                <CheckCircle2 className="size-4" /> Settings Saved
                            </div>
                        )}
                        <Button 
                            disabled={processing} 
                            className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        >
                            {processing ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="size-4 mr-2" />
                            )}
                            Update Configuration
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AdminSettings.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Settings', href: '#' }]}>
        {page}
    </AppLayout>
);
