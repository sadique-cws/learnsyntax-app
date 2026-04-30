import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ShieldCheck, Award, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react';

export default function CertificateView({ certificate }: { certificate: any }) {
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        // Trigger print dialog on load for a "Download" feel
        const timer = setTimeout(() => window.print(), 800);
        return () => clearTimeout(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 print:p-0 print:bg-white">
            <Head title={`Certificate - ${certificate.certificate_number}`} />
            
            {/* Action Bar (Hidden in Print) */}
            <div className="w-full max-w-[1000px] flex justify-between items-center mb-8 print:hidden">
                <div className="flex items-center gap-2">
                    <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                        <Award className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Official Certificate</h1>
                        <p className="text-xs text-muted-foreground font-mono">#{certificate.certificate_number}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} variant="outline" className="rounded-sm shadow-none h-9 text-xs font-bold gap-2">
                        <Printer className="size-3.5" /> Print / Save as PDF
                    </Button>
                </div>
            </div>

            {/* Certificate Canvas */}
            <div className="w-full max-w-[1000px] aspect-[1.414/1] bg-white shadow-2xl rounded-sm overflow-hidden relative border-[12px] border-slate-900 print:shadow-none print:border-[10px] print:rounded-none">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900 -mr-32 -mt-32 rotate-45"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900 -ml-32 -mb-32 rotate-45"></div>

                {/* Content */}
                <div className="h-full flex flex-col p-16 relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-16">
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-10 bg-slate-900 flex items-center justify-center text-white rounded-sm">
                                    <span className="text-xl font-black">LS</span>
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-slate-900">LEARNSYNTAX</span>
                            </div>
                            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Academy of Digital Excellence</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Number</div>
                            <div className="text-sm font-mono font-black text-slate-900">{certificate.certificate_number}</div>
                        </div>
                    </div>

                    {/* Main Text */}
                    <div className="flex-1 flex flex-col items-center text-center">
                        <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tight uppercase leading-none">
                            Certificate of <br/> Achievement
                        </h2>
                        
                        <div className="w-24 h-1 bg-slate-900 mb-8"></div>
                        
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">This is to certify that</p>
                        <h3 className="text-4xl font-serif font-black text-slate-900 mb-6 italic">{certificate.enrollment.user.name}</h3>
                        
                        <p className="text-base text-slate-600 max-w-[600px] leading-relaxed">
                            has successfully completed all requirements for the professional course in <br/>
                            <span className="font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4">{certificate.enrollment.course.title}</span> <br/>
                            demonstrating exceptional proficiency and dedication in the field.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end mt-16 pt-16 border-t border-slate-100">
                        <div className="flex flex-col items-start gap-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-5 text-slate-900" />
                                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Academic Record</div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issued Date</div>
                                    <div className="text-xs font-black text-slate-900">{new Date(certificate.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accreditation</div>
                                    <div className="text-xs font-black text-slate-900 text-emerald-600">ISO 9001:2015</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="mb-2 font-serif italic text-2xl text-slate-800">Admin Team</div>
                            <div className="w-48 h-px bg-slate-300 mb-2"></div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Authorized Signatory <br/> LearnSyntax App</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Seal */}
                <div className="absolute bottom-16 right-64 opacity-10">
                    <Award className="size-48 text-slate-900" />
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { margin: 0; background: white; }
                    .print-hidden { display: none !important; }
                }
            ` }} />
        </div>
    );
}
