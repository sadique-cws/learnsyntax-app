<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            // KYC status: null = not submitted, pending, approved, rejected
            $table->string('kyc_status')->nullable()->after('wallet_balance');
            // Aadhaar details
            $table->string('aadhaar_number', 12)->nullable()->after('kyc_status');
            $table->string('aadhaar_front_path')->nullable()->after('aadhaar_number');
            $table->string('aadhaar_back_path')->nullable()->after('aadhaar_front_path');
            // Bank details (saved after KYC approval)
            $table->string('bank_name')->nullable()->after('aadhaar_back_path');
            $table->string('account_holder_name')->nullable()->after('bank_name');
            $table->string('account_number')->nullable()->after('account_holder_name');
            $table->string('ifsc_code')->nullable()->after('account_number');
            // Admin review
            $table->text('kyc_rejection_reason')->nullable()->after('ifsc_code');
            $table->timestamp('kyc_submitted_at')->nullable()->after('kyc_rejection_reason');
            $table->timestamp('kyc_reviewed_at')->nullable()->after('kyc_submitted_at');
        });
    }

    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'kyc_status', 'aadhaar_number', 'aadhaar_front_path', 'aadhaar_back_path',
                'bank_name', 'account_holder_name', 'account_number', 'ifsc_code',
                'kyc_rejection_reason', 'kyc_submitted_at', 'kyc_reviewed_at',
            ]);
        });
    }
};
