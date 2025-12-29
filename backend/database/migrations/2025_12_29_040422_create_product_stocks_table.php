<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_stocks', function (Blueprint $table) {
            $table->id();
            // Relación 1 a 1 o 1 a N con productos
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Cantidad disponible
            $table->integer('stock')->default(0);

            // Podrías añadir alertas de stock bajo en el futuro aquí
            $table->integer('min_stock')->default(1);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_stocks');
    }
};
