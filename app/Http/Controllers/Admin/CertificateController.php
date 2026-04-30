<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::with(['enrollment.user', 'enrollment.course'])
            ->latest()
            ->get();

        return Inertia::render('admin/certificates/index', [
            'certificates' => $certificates,
        ]);
    }

    public function qualified()
    {
        // Get enrollments where overall average is >= 60% and no certificate issued yet
        $qualified = Enrollment::with(['user', 'course'])
            ->whereDoesntHave('certificate')
            ->get()
            ->filter(fn ($e) => $e->overall_average >= 60)
            ->values();

        return Inertia::render('admin/students/qualified', [
            'qualified' => $qualified,
        ]);
    }
    public function download(Certificate $certificate)
    {
        $certificate->load(['enrollment.user', 'enrollment.course']);
        
        return Inertia::render('admin/certificates/view', [
            'certificate' => $certificate,
        ]);
    }
}
