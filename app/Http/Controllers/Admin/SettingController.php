<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::first() ?: new Setting;

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string',
            'company_address' => 'required|string',
            'company_gstin' => 'required|string',
            'company_state' => 'required|string',
            'company_state_code' => 'required|string',
            'company_email' => 'required|email',
            'company_phone' => 'required|string',
            'bank_name' => 'nullable|string',
            'bank_account_no' => 'nullable|string',
            'bank_ifsc' => 'nullable|string',
            'bank_branch' => 'nullable|string',
            'declaration' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'signature' => 'nullable|image|max:1024',
        ]);

        $settings = Setting::first() ?: new Setting;

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('branding', 'public');
        }

        if ($request->hasFile('signature')) {
            $data['authority_signature_path'] = $request->file('signature')->store('branding', 'public');
        }

        // Remove the file objects from the data array before saving to DB
        unset($data['logo'], $data['signature']);

        $settings->fill($data);
        $settings->save();

        return back()->with('success', 'Settings updated successfully.');
    }
}
