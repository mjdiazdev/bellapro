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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained();
            $table->string('delivery_email');
            $table->string('delivery_name');
            $table->string('delivery_nif')->nullable();
            $table->string('delivery_address');
            $table->string('delivery_address_extra')->nullable();
            $table->string('delivery_phone')->nullable();
            $table->foreignId('delivery_postal_code_id')->nullable()->constrained('postal_codes');
            $table->foreignId('shipping_method_id')->nullable()->constrained('shipping_methods');
            $table->decimal('subtotal',12,2);
            $table->decimal('shipping_price',12,2)->default(0);
            $table->decimal('total',12,2);
            $table->string('status')->default('pending'); // pending, paid, cancelled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
