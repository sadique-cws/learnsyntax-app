<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'commission_percent', 'wallet_balance',
        // KYC fields
        'kyc_status', 'aadhaar_number', 'aadhaar_front_path', 'aadhaar_back_path',
        'bank_name', 'account_holder_name', 'account_number', 'ifsc_code',
        'kyc_rejection_reason', 'kyc_submitted_at', 'kyc_reviewed_at',
    ];

    protected $casts = [
        'commission_percent'  => 'decimal:2',
        'wallet_balance'      => 'decimal:2',
        'kyc_submitted_at'    => 'datetime',
        'kyc_reviewed_at'     => 'datetime',
    ];

    /** KYC has been approved by admin */
    public function isKycApproved(): bool
    {
        return $this->kyc_status === 'approved';
    }

    /** KYC has been submitted but not yet reviewed */
    public function isKycPending(): bool
    {
        return $this->kyc_status === 'pending';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function withdrawalRequests()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }
}
