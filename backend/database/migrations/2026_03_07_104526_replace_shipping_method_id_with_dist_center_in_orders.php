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
        Schema::table('orders', function (Blueprint $table) {
            // Drop old FK constraint and column
            $table->dropForeign('orders_shipping_method_id_foreign');
            $table->dropColumn('shipping_method_id');

            // Add new column pointing to the pivot table
            $table->foreignId('dist_center_shipping_method_id')
                ->nullable()
                ->constrained('dist_center_shipping_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['dist_center_shipping_method_id']);
            $table->dropColumn('dist_center_shipping_method_id');

            $table->foreignId('shipping_method_id')
                ->nullable()
                ->constrained('shipping_methods');
        });
    }
};
