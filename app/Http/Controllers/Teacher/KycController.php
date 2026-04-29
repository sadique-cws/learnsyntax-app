<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KycController extends Controller
{
    public function show()
    {
        $teacher = auth()->user()->teacher;

        return inertia('teacher/kyc/index', [
            'teacher' => [
                'kyc_status'           => $teacher->kyc_status,
                'aadhaar_number'       => $teacher->aadhaar_number,
                'bank_name'            => $teacher->bank_name,
                'account_holder_name'  => $teacher->account_holder_name,
                'account_number'       => $teacher->account_number,
                'ifsc_code'            => $teacher->ifsc_code,
                'kyc_rejection_reason' => $teacher->kyc_rejection_reason,
                'kyc_submitted_at'     => $teacher->kyc_submitted_at?->toDateString(),
                'aadhaar_front_path'   => $teacher->aadhaar_front_path
                    ? Storage::url($teacher->aadhaar_front_path) : null,
                'aadhaar_back_path'    => $teacher->aadhaar_back_path
                    ? Storage::url($teacher->aadhaar_back_path) : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $teacher = auth()->user()->teacher;

        // Block resubmission if already approved or pending
        if ($teacher->kyc_status === 'approved') {
            return back()->withErrors(['kyc' => 'Your KYC is already approved.']);
        }

        $request->validate([
            'aadhaar_number'       => 'required|digits:12',
            'aadhaar_front'        => 'required|file|mimes:jpg,jpeg,png,pdf|max:3072',
            'aadhaar_back'         => 'required|file|mimes:jpg,jpeg,png,pdf|max:3072',
            'bank_name'            => 'required|string|max:255',
            'account_holder_name'  => 'required|string|max:255',
            'account_number'       => 'required|string|max:20',
            'ifsc_code'            => 'required|string|max:11',
        ]);

        $frontPath = $request->file('aadhaar_front')->store('kyc/aadhaar', 'public');
        $backPath  = $request->file('aadhaar_back')->store('kyc/aadhaar', 'public');

        $teacher->update([
            'kyc_status'           => 'pending',
            'aadhaar_number'       => $request->aadhaar_number,
            'aadhaar_front_path'   => $frontPath,
            'aadhaar_back_path'    => $backPath,
            'bank_name'            => $request->bank_name,
            'account_holder_name'  => $request->account_holder_name,
            'account_number'       => $request->account_number,
            'ifsc_code'            => strtoupper($request->ifsc_code),
            'kyc_submitted_at'     => now(),
            'kyc_rejection_reason' => null,
        ]);

        return redirect()->route('teacher.kyc')
            ->with('success', 'KYC submitted successfully. We will review it within 1-2 business days.');
    }
}
