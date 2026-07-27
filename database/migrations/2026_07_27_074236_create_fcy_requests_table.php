<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fcy_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('proforma_invoice_number');
            $table->date('proforma_invoice_date');
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();
            $table->foreignId('currency_id')->constrained()->cascadeOnDelete();
            $table->decimal('fcy_amount_requested', 15, 2);
            $table->decimal('total_amount_in_usd', 15, 2);
            $table->text('importing_items');
            $table->string('supplier_country');
            $table->string('status')->default('draft');
            $table->string('maker_id');
            $table->string('checker_id')->nullable();
            $table->string('approver_id')->nullable();
            $table->text('maker_notes')->nullable();
            $table->text('checker_notes')->nullable();
            $table->text('approver_notes')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fcy_requests');
    }
};
