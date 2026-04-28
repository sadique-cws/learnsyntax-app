<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'payment_id',
        'invoice_number',
        'amount',
        'taxable_amount',
        'cgst',
        'sgst',
        'igst',
        'gst_number',
        'sac_code',
        'status',
        'issued_at',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
