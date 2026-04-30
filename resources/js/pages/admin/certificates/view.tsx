import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CertificateView({ certificate }: { certificate: any }) {
    useEffect(() => {
        // Trigger print dialog on load for a "Download" feel
        const timer = setTimeout(() => window.print(), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Calculate dates (hardcoded for now as per user request, but can be dynamic)
    const startDate = "23 Dec 2025";
    const endDate = "05 Jan 2026";
    const duration = "2-Week";

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4 print:p-0 print:bg-white">
            <Head title={`Certificate - ${certificate.certificate_number}`} />
            
            {/* Action Bar (Hidden in Print) */}
            <div className="w-full max-w-[1100px] flex justify-between items-center mb-8 print:hidden">
                <div className="flex items-center gap-2">
                    <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                        <Award className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Internship Certificate</h1>
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
            <div className="certificate-canvas w-full max-w-[1100px] aspect-[1.414/1] bg-white shadow-sm border-4 border-black relative print:shadow-none overflow-hidden">
                {/* Background Image Template */}
                <img 
                    src="/certificate.png" 
                    alt="Certificate Template" 
                    className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Overlaid Dynamic Content */}
                <div className="absolute inset-0 flex flex-col items-center pointer-events-none">
                    
                    {/* Certificate Number (Vertical on Right) */}
                    <div className="absolute top-[66%] right-[2.8%] rotate-90 origin-right text-[18px] font-bold text-slate-900 font-mono tracking-wider">
                        {certificate.certificate_number}
                    </div>

                    {/* Achiever Name - Positioned on the line */}
                    <div className="absolute top-[43.5%] w-full text-center px-24">
                        <h3 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight">
                            {certificate.enrollment.user.name}
                        </h3>
                    </div>

                    {/* Certification Text - Below the line */}
                    <div className="absolute top-[56%] w-full px-24 md:px-32 text-center">
                        <p className="text-[13px] md:text-[14px] leading-[1.8] text-slate-800 font-medium max-w-[850px] mx-auto text-justify md:text-center">
                            This is to certify that <span className="font-bold">Mr. {certificate.enrollment.user.name}</span> has successfully completed a 
                            <span className="font-bold"> {duration} Internship Program</span> at 
                            <span className="font-bold"> Comestro Techlabs Pvt. Ltd.</span>, in partial fulfillment of the 
                            <span className="font-bold"> B.Tech curriculum</span>, conducted in 
                            <span className="font-bold"> Offline mode</span> from 
                            <span className="font-bold"> {startDate} to {endDate}</span>. 
                            His performance was found to be sincere and satisfactory.
                        </p>
                    </div>

                    {/* Signatory Name could go here if needed, but template already has "CEO / Director" */}
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: landscape; margin: 0; }
                    
                    /* Hide everything by default */
                    body * {
                        visibility: hidden !important;
                    }
                    
                    /* Show only the certificate canvas and its children */
                    .certificate-canvas, .certificate-canvas * {
                        visibility: visible !important;
                    }
                    
                    /* Reset body background and positioning */
                    body { 
                        margin: 0 !important; 
                        padding: 0 !important;
                        background: white !important; 
                    }
                    
                    /* Position the canvas at the top left of the print page */
                    .certificate-canvas {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: none !important;
                        max-height: none !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        transform: none !important;
                        page-break-after: avoid !important;
                        page-break-before: avoid !important;
                    }

                    /* Prevent extra blank pages */
                    html, body {
                        height: 100% !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    /* Hide the action bar specifically just in case */
                    .print-hidden { display: none !important; }
                }
            ` }} />
        </div>
    );
}
