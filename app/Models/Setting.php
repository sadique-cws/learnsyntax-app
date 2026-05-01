<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function getCompanyInfo()
    {
        return self::first() ?: new self([
            'company_name' => 'Learn Syntax Academy',
            'company_address' => '123 Tech Park, Sector 62, Noida, UP - 201309',
            'company_gstin' => '09ABCDE1234F1Z5',
            'company_email' => 'billing@learnsyntax.com',
            'company_phone' => '+91 98765 43210',
            'company_state' => 'Uttar Pradesh',
            'company_state_code' => '09',
            'declaration' => '1. All disputes are subject to Noida jurisdiction only. 2. This is a computer generated invoice and does not require signature.',
        ]);
    }
}
