<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithdrawalRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'amount',
        'bank_name',
        'account_number',
        'ifsc_code',
        'account_holder_name',
        'status',
        'admin_notes',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
