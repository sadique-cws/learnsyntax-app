<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['enrollment_id', 'razorpay_order_id', 'razorpay_payment_id', 'amount', 'currency', 'status'])]
class Payment extends Model
{
    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
