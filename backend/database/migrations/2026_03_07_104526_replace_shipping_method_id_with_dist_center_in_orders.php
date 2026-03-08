<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PASO 1: Intentar borrar la llave foránea de forma aislada
        try {
            Schema::table('orders', function (Blueprint $table) {
                // Usamos el array para que Laravel busque el nombre dinámicamente
                $table->dropForeign(['shipping_method_id']);
            });
        } catch (\Exception $e) {
            // Si falla, es porque no existe la relación. No hacemos nada.
        }

        // PASO 2: Borrar la columna y añadir la nueva
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'shipping_method_id')) {
                $table->dropColumn('shipping_method_id');
            }

            // Añadimos la nueva columna
            if (!Schema::hasColumn('orders', 'dist_center_shipping_method_id')) {
                $table->foreignId('dist_center_shipping_method_id')
                    ->nullable()
                    ->after('delivery_postal_code_id')
                    ->constrained('dist_center_shipping_method');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            try {
                $table->dropForeign(['dist_center_shipping_method_id']);
            } catch (\Exception $e) {}

            $table->dropColumn('dist_center_shipping_method_id');

            $table->foreignId('shipping_method_id')
                ->nullable()
                ->constrained('shipping_methods');
        });
    }
};
