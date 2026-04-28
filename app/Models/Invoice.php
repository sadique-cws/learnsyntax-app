<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['payment_id', 'invoice_number', 'amount', 'taxable_amount', 'cgst', 'sgst', 'igst', 'gst_number', 'issued_at'])]
class Invoice extends Model
{
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
