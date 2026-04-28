<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('invoices', 'taxable_amount')) {
                $table->decimal('taxable_amount', 10, 2)->after('amount')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'cgst')) {
                $table->decimal('cgst', 10, 2)->after('taxable_amount')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'sgst')) {
                $table->decimal('sgst', 10, 2)->after('cgst')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'igst')) {
                $table->decimal('igst', 10, 2)->after('sgst')->default(0);
            }
            if (!Schema::hasColumn('invoices', 'status')) {
                $table->string('status')->after('amount')->default('paid');
            }
            if (!Schema::hasColumn('invoices', 'gst_number')) {
                $table->string('gst_number')->nullable()->after('invoice_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            //
        });
    }
};
