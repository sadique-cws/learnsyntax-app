import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Landmark, FileText, Save, CheckCircle2, Globe } from 'lucide-react';

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
        logo: null as File | null,
        signature: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <>
            <Head title="Invoice Configuration" />
            
            <div className="w-full p-4 lg:p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-foreground">Invoice Configuration</h1>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-0.5">Manage company details & tax compliance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {recentlySuccessful && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                                <CheckCircle2 className="size-3" /> Saved
                            </div>
                        )}
                        <Button 
                            onClick={submit}
                            disabled={processing} 
                            className="rounded-sm h-9 px-6 bg-primary shadow-lg shadow-primary/10 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            {processing ? (
                                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : (
                                <Save className="size-3.5 mr-2" />
                            )}
                            Update Configuration
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-5">
                        {/* Company Details */}
                        <Card className="border-border rounded-sm shadow-none bg-background">
                            <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-3.5 text-primary" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Company Profile</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Legal Entity Name</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                        value={data.company_name}
                                        onChange={e => setData('company_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Registered Address</Label>
                                    <Textarea 
                                        className="min-h-[80px] rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors resize-none p-3"
                                        value={data.company_address}
                                        onChange={e => setData('company_address', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Support Email</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                        value={data.company_email}
                                        onChange={e => setData('company_email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Contact Phone</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                        value={data.company_phone}
                                        onChange={e => setData('company_phone', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bank Details */}
                        <Card className="border-border rounded-sm shadow-none bg-background">
                            <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Landmark className="size-3.5 text-primary" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Settlement Info</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Bank Name</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                        value={data.bank_name}
                                        onChange={e => setData('bank_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Account Number</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs font-mono focus:bg-background transition-colors"
                                        value={data.bank_account_no}
                                        onChange={e => setData('bank_account_no', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">IFSC / Swift</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs font-mono uppercase focus:bg-background transition-colors"
                                        value={data.bank_ifsc}
                                        onChange={e => setData('bank_ifsc', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Branch Locality</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                        value={data.bank_branch}
                                        onChange={e => setData('bank_branch', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-5">
                        {/* Branding */}
                        <Card className="border-border rounded-sm shadow-none bg-background">
                            <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Globe className="size-3.5 text-primary" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Branding</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Company Logo</Label>
                                    <div className="flex flex-col items-center gap-4 p-4 border border-dashed border-border rounded-sm bg-muted/5">
                                        {settings.logo_path ? (
                                            <img src={`/storage/${settings.logo_path}`} className="h-16 object-contain" />
                                        ) : (
                                            <div className="size-16 rounded-sm bg-muted flex items-center justify-center text-muted-foreground/20 italic text-[10px]">No Logo</div>
                                        )}
                                        <Input 
                                            type="file" 
                                            className="text-[10px] h-auto p-1" 
                                            onChange={e => setData('logo', e.target.files?.[0] || null)}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Authorized Signature</Label>
                                    <div className="flex flex-col items-center gap-4 p-4 border border-dashed border-border rounded-sm bg-muted/5">
                                        {settings.authority_signature_path ? (
                                            <img src={`/storage/${settings.authority_signature_path}`} className="h-12 object-contain" />
                                        ) : (
                                            <div className="size-12 rounded-sm bg-muted flex items-center justify-center text-muted-foreground/20 italic text-[10px]">No Sign</div>
                                        )}
                                        <Input 
                                            type="file" 
                                            className="text-[10px] h-auto p-1" 
                                            onChange={e => setData('signature', e.target.files?.[0] || null)}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tax & Compliance */}
                        <Card className="border-border rounded-sm shadow-none bg-background">
                            <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <FileText className="size-3.5 text-primary" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Compliance</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">GSTIN Identification</Label>
                                    <Input 
                                        className="h-9 rounded-sm border-border bg-muted/10 text-xs font-mono uppercase focus:bg-background transition-colors"
                                        value={data.company_gstin}
                                        onChange={e => setData('company_gstin', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">State</Label>
                                        <Input 
                                            className="h-9 rounded-sm border-border bg-muted/10 text-xs focus:bg-background transition-colors"
                                            value={data.company_state}
                                            onChange={e => setData('company_state', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Code</Label>
                                        <Input 
                                            className="h-9 rounded-sm border-border bg-muted/10 text-xs font-mono focus:bg-background transition-colors"
                                            value={data.company_state_code}
                                            onChange={e => setData('company_state_code', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Invoice Footer Note</Label>
                                    <Textarea 
                                        className="min-h-[100px] rounded-sm border-border bg-muted/10 text-[10px] mt-2 focus:bg-background transition-colors resize-none"
                                        value={data.declaration}
                                        onChange={e => setData('declaration', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminSettings.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Configuration', href: '/admin/settings' }]}>
        {page}
    </AppLayout>
);
