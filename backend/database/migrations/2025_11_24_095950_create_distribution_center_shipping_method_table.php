<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dist_center_shipping_method', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_center_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('shipping_method_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dist_center_shipping_method');
    }
};
