import React, { useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Upload, AlertCircle, Clock, CheckCircle2, XCircle, CreditCard, Landmark, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TeacherLayout from '@/layouts/teacher-layout';

type KycStatus = 'pending' | 'approved' | 'rejected' | null;

interface TeacherKyc {
    kyc_status: KycStatus;
    aadhaar_number: string | null;
    bank_name: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    kyc_rejection_reason: string | null;
    kyc_submitted_at: string | null;
    aadhaar_front_path: string | null;
    aadhaar_back_path: string | null;
}

export default function KycPage({ teacher }: { teacher: TeacherKyc }) {
    const { data, setData, post, processing, errors } = useForm({
        aadhaar_number: '',
        aadhaar_front: null as File | null,
        aadhaar_back: null as File | null,
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
    });

    const frontRef = useRef<HTMLInputElement>(null);
    const backRef  = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/kyc', { forceFormData: true });
    };

    const statusConfig = {
        pending:  { icon: Clock,          color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  label: 'Under Review' },
        approved: { icon: CheckCircle2,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'KYC Verified' },
        rejected: { icon: XCircle,        color: 'text-red-600',    bg: 'bg-red-50 border-red-200',      label: 'Verification Failed' },
    };

    const status = teacher.kyc_status ? statusConfig[teacher.kyc_status] : null;

    return (
        <>
            <Head title="KYC Verification" />
            <div className="w-full p-4 lg:p-6 space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="size-7 rounded-sm border border-border text-muted-foreground hover:bg-muted shrink-0">
                        <Link href="/teacher/wallet"><ArrowLeft className="size-3.5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <ShieldCheck className="size-4 text-muted-foreground" /> KYC Verification
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Required to enable withdrawals from your wallet</p>
                    </div>
                </div>

                {/* Status Banner */}
                {status && (
                    <div className={`flex items-start gap-3 px-4 py-3 rounded-sm border ${status.bg}`}>
                        <status.icon className={`size-4 ${status.color} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                            <p className={`text-xs font-semibold ${status.color}`}>{status.label}</p>
                            {teacher.kyc_status === 'pending' && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Submitted on {teacher.kyc_submitted_at} · Typically reviewed within 1–2 business days.
                                </p>
                            )}
                            {teacher.kyc_status === 'approved' && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Your identity is verified. You can now request withdrawals from your wallet.
                                </p>
                            )}
                            {teacher.kyc_status === 'rejected' && teacher.kyc_rejection_reason && (
                                <p className="text-[10px] text-red-600 mt-0.5">
                                    Reason: {teacher.kyc_rejection_reason}
                                </p>
                            )}
                        </div>
                        {teacher.kyc_status === 'approved' && (
                            <Button asChild size="sm" className="h-7 px-3 rounded-sm text-xs shadow-none shrink-0 font-medium">
                                <Link href="/teacher/wallet/withdraw">
                                    <Landmark className="size-3 mr-1.5" /> Withdraw Funds
                                </Link>
                            </Button>
                        )}
                    </div>
                )}

                {/* Approved — show saved details only */}
                {teacher.kyc_status === 'approved' ? (
                    <div className="max-w-xl space-y-3">
                        <div className="rounded-sm border border-border overflow-hidden">
                            <div className="px-3 py-2 bg-muted/5 border-b border-border flex items-center gap-1.5">
                                <FileText className="size-3.5 text-muted-foreground" />
                                <span className="text-xs font-semibold">Verified Identity</span>
                            </div>
                            <div className="p-3 space-y-2 text-xs">
                                <InfoRow label="Aadhaar Number" value={`XXXX XXXX ${teacher.aadhaar_number?.slice(-4)}`} />
                                <InfoRow label="Account Holder" value={teacher.account_holder_name} />
                                <InfoRow label="Bank" value={teacher.bank_name} />
                                <InfoRow label="IFSC Code" value={teacher.ifsc_code} />
                            </div>
                        </div>
                        {(teacher.aadhaar_front_path || teacher.aadhaar_back_path) && (
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="px-3 py-2 bg-muted/5 border-b border-border">
                                    <span className="text-xs font-semibold">Aadhaar Documents</span>
                                </div>
                                <div className="p-3 grid grid-cols-2 gap-2">
                                    {teacher.aadhaar_front_path && (
                                        <a href={teacher.aadhaar_front_path} target="_blank" className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm hover:bg-muted/20 transition-colors">
                                            <Eye className="size-3 text-muted-foreground" />
                                            <span className="text-[10px] font-medium">Front Side</span>
                                        </a>
                                    )}
                                    {teacher.aadhaar_back_path && (
                                        <a href={teacher.aadhaar_back_path} target="_blank" className="flex items-center gap-2 px-3 py-2 border border-border rounded-sm hover:bg-muted/20 transition-colors">
                                            <Eye className="size-3 text-muted-foreground" />
                                            <span className="text-[10px] font-medium">Back Side</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (teacher.kyc_status !== 'pending') ? (

                    /* KYC Form — for null (not started) or rejected */
                    <div className="max-w-xl space-y-3">

                        {/* What is KYC notice */}
                        {!teacher.kyc_status && (
                            <div className="flex items-start gap-2.5 p-3 rounded-sm bg-primary/5 border border-primary/15">
                                <AlertCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-primary">KYC verification required</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                        To comply with RBI guidelines, we require all educators to verify their identity with an Aadhaar card and valid bank account before processing payouts.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-3">

                            {/* Aadhaar Section */}
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="px-3 py-2 bg-muted/5 border-b border-border flex items-center gap-1.5">
                                    <CreditCard className="size-3.5 text-muted-foreground" />
                                    <span className="text-xs font-semibold">Aadhaar Identity</span>
                                </div>
                                <div className="p-3 space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Aadhaar Number</Label>
                                        <Input
                                            type="text"
                                            placeholder="12-digit Aadhaar number"
                                            maxLength={12}
                                            className="h-8 rounded-sm text-sm border-border font-mono"
                                            value={data.aadhaar_number}
                                            onChange={e => setData('aadhaar_number', e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                        {errors.aadhaar_number && <p className="text-[10px] text-red-500">{errors.aadhaar_number}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Front */}
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Aadhaar Front</Label>
                                            <input type="file" accept="image/*,.pdf" ref={frontRef} className="hidden"
                                                onChange={e => setData('aadhaar_front', e.target.files?.[0] || null)} />
                                            <button type="button" onClick={() => frontRef.current?.click()}
                                                className="w-full h-20 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/10 transition-colors cursor-pointer">
                                                {data.aadhaar_front ? (
                                                    <>
                                                        <CheckCircle2 className="size-4 text-emerald-500" />
                                                        <span className="text-[10px] font-medium text-emerald-600 text-center px-1 truncate w-full text-center">{data.aadhaar_front.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="size-4 text-muted-foreground/40" />
                                                        <span className="text-[10px] text-muted-foreground">Front Side</span>
                                                    </>
                                                )}
                                            </button>
                                            {errors.aadhaar_front && <p className="text-[10px] text-red-500">{errors.aadhaar_front}</p>}
                                        </div>
                                        {/* Back */}
                                        <div className="space-y-1">
                                            <Label className="text-xs font-medium text-muted-foreground">Aadhaar Back</Label>
                                            <input type="file" accept="image/*,.pdf" ref={backRef} className="hidden"
                                                onChange={e => setData('aadhaar_back', e.target.files?.[0] || null)} />
                                            <button type="button" onClick={() => backRef.current?.click()}
                                                className="w-full h-20 border border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/10 transition-colors cursor-pointer">
                                                {data.aadhaar_back ? (
                                                    <>
                                                        <CheckCircle2 className="size-4 text-emerald-500" />
                                                        <span className="text-[10px] font-medium text-emerald-600 text-center px-1 truncate w-full text-center">{data.aadhaar_back.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="size-4 text-muted-foreground/40" />
                                                        <span className="text-[10px] text-muted-foreground">Back Side</span>
                                                    </>
                                                )}
                                            </button>
                                            {errors.aadhaar_back && <p className="text-[10px] text-red-500">{errors.aadhaar_back}</p>}
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground">Upload clear photos or scans. Max 3MB each. JPG, PNG, or PDF accepted.</p>
                                </div>
                            </div>

                            {/* Bank Details Section */}
                            <div className="rounded-sm border border-border overflow-hidden">
                                <div className="px-3 py-2 bg-muted/5 border-b border-border flex items-center gap-1.5">
                                    <Landmark className="size-3.5 text-muted-foreground" />
                                    <span className="text-xs font-semibold">Bank Account</span>
                                </div>
                                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1 md:col-span-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Account Holder Name</Label>
                                        <Input placeholder="As per bank records" className="h-8 rounded-sm text-sm border-border"
                                            value={data.account_holder_name} onChange={e => setData('account_holder_name', e.target.value)} required />
                                        {errors.account_holder_name && <p className="text-[10px] text-red-500">{errors.account_holder_name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">Bank Name</Label>
                                        <Input placeholder="E.g. State Bank of India" className="h-8 rounded-sm text-sm border-border"
                                            value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} required />
                                        {errors.bank_name && <p className="text-[10px] text-red-500">{errors.bank_name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-muted-foreground">IFSC Code</Label>
                                        <Input placeholder="E.g. SBIN0001234" className="h-8 rounded-sm text-sm border-border uppercase"
                                            value={data.ifsc_code} onChange={e => setData('ifsc_code', e.target.value.toUpperCase())} required />
                                        {errors.ifsc_code && <p className="text-[10px] text-red-500">{errors.ifsc_code}</p>}
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Account Number</Label>
                                        <Input type="password" placeholder="Enter account number" className="h-8 rounded-sm text-sm border-border"
                                            value={data.account_number} onChange={e => setData('account_number', e.target.value)} required />
                                        {errors.account_number && <p className="text-[10px] text-red-500">{errors.account_number}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex items-center justify-between pt-1">
                                <p className="text-[10px] text-muted-foreground">
                                    Your data is encrypted and only used for payout verification.
                                </p>
                                <Button type="submit" disabled={processing} size="sm" className="h-8 px-5 rounded-sm text-xs shadow-none font-medium shrink-0">
                                    {processing ? 'Submitting...' : <span className="flex items-center gap-1.5"><ShieldCheck className="size-3" /> Submit KYC</span>}
                                </Button>
                            </div>
                        </form>
                    </div>

                ) : null /* pending state — banner already shown above */}

            </div>
        </>
    );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground">{value || '—'}</span>
        </div>
    );
}

KycPage.layout = (page: React.ReactNode) => (
    <TeacherLayout breadcrumbs={[{ title: 'Dashboard', href: '/teacher/dashboard' }, { title: 'Wallet', href: '/teacher/wallet' }, { title: 'KYC', href: '#' }]}>
        {page}
    </TeacherLayout>
);
