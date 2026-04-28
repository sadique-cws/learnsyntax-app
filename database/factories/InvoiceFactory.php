<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'invoice_number' => 'INV-'.date('Y').'-'.str()->random(5),
            'taxable_amount' => 847.46,
            'cgst' => 76.27,
            'sgst' => 76.27,
            'igst' => 0,
            'amount' => 1000,
            'status' => 'paid',
            'issued_at' => now(),
        ];
    }
}
