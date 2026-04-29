import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Building2, Landmark, FileText, Save, CheckCircle2, Globe, Upload } from 'lucide-react';

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

    const submit = (e: React.FormEvent) => { e.preventDefault(); post('/admin/settings'); };

    const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/5">
            <Icon className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
    );

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
            {children}
        </div>
    );

    return (
        <>
            <Head title="Settings" />
            <div className="w-full p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Invoice Settings</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Company details and tax configuration</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {recentlySuccessful && (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium animate-in fade-in">
                                <CheckCircle2 className="size-3" /> Saved
                            </span>
                        )}
                        <Button onClick={submit} disabled={processing} size="sm" className="h-8 px-3 rounded-sm text-xs font-medium shadow-none">
                            <Save className="size-3.5 mr-1.5" /> Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-8 space-y-3">
                        <div className="border border-border rounded-sm overflow-hidden">
                            <SectionHeader icon={Building2} title="Company Profile" />
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                    <Field label="Legal Entity Name">
                                        <Input className="h-9 rounded-sm text-sm shadow-none" value={data.company_name} onChange={e => setData('company_name', e.target.value)} />
                                    </Field>
                                </div>
                                <div className="md:col-span-2">
                                    <Field label="Registered Address">
                                        <Textarea className="min-h-[72px] rounded-sm text-sm shadow-none resize-none" value={data.company_address} onChange={e => setData('company_address', e.target.value)} />
                                    </Field>
                                </div>
                                <Field label="Email">
                                    <Input className="h-9 rounded-sm text-sm shadow-none" value={data.company_email} onChange={e => setData('company_email', e.target.value)} />
                                </Field>
                                <Field label="Phone">
                                    <Input className="h-9 rounded-sm text-sm shadow-none" value={data.company_phone} onChange={e => setData('company_phone', e.target.value)} />
                                </Field>
                            </div>
                        </div>

                        <div className="border border-border rounded-sm overflow-hidden">
                            <SectionHeader icon={Landmark} title="Bank Details" />
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Field label="Bank Name"><Input className="h-9 rounded-sm text-sm shadow-none" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} /></Field>
                                <Field label="Account Number"><Input className="h-9 rounded-sm text-sm font-mono shadow-none" value={data.bank_account_no} onChange={e => setData('bank_account_no', e.target.value)} /></Field>
                                <Field label="IFSC Code"><Input className="h-9 rounded-sm text-sm font-mono shadow-none" value={data.bank_ifsc} onChange={e => setData('bank_ifsc', e.target.value)} /></Field>
                                <Field label="Branch"><Input className="h-9 rounded-sm text-sm shadow-none" value={data.bank_branch} onChange={e => setData('bank_branch', e.target.value)} /></Field>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-3">
                        <div className="border border-border rounded-sm overflow-hidden">
                            <SectionHeader icon={Globe} title="Branding" />
                            <div className="p-4 space-y-4">
                                <Field label="Company Logo">
                                    <div className="flex flex-col items-center gap-3 p-3 border border-dashed border-border rounded-sm bg-muted/5">
                                        {settings.logo_path ? <img src={`/storage/${settings.logo_path}`} className="h-12 object-contain" /> : <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">No logo</div>}
                                        <Input type="file" className="text-xs h-auto p-1" onChange={e => setData('logo', e.target.files?.[0] || null)} accept="image/*" />
                                    </div>
                                </Field>
                                <Field label="Authorized Signature">
                                    <div className="flex flex-col items-center gap-3 p-3 border border-dashed border-border rounded-sm bg-muted/5">
                                        {settings.authority_signature_path ? <img src={`/storage/${settings.authority_signature_path}`} className="h-10 object-contain" /> : <div className="h-10 flex items-center justify-center text-xs text-muted-foreground">No signature</div>}
                                        <Input type="file" className="text-xs h-auto p-1" onChange={e => setData('signature', e.target.files?.[0] || null)} accept="image/*" />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        <div className="border border-border rounded-sm overflow-hidden">
                            <SectionHeader icon={FileText} title="Tax & Compliance" />
                            <div className="p-4 space-y-3">
                                <Field label="GSTIN"><Input className="h-9 rounded-sm text-sm font-mono shadow-none" value={data.company_gstin} onChange={e => setData('company_gstin', e.target.value)} /></Field>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="State"><Input className="h-9 rounded-sm text-sm shadow-none" value={data.company_state} onChange={e => setData('company_state', e.target.value)} /></Field>
                                    <Field label="State Code"><Input className="h-9 rounded-sm text-sm font-mono shadow-none" value={data.company_state_code} onChange={e => setData('company_state_code', e.target.value)} /></Field>
                                </div>
                                <div className="pt-3 border-t border-border">
                                    <Field label="Invoice Footer">
                                        <Textarea className="min-h-[80px] rounded-sm text-xs shadow-none resize-none mt-1" value={data.declaration} onChange={e => setData('declaration', e.target.value)} />
                                    </Field>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminSettings.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '#' }, { title: 'Settings', href: '/admin/settings' }]}>{page}</AppLayout>
);
