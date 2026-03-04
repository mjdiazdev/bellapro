<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('shipping_methods', function (Blueprint $table) {
            // Añadimos la columna status, por defecto activo (true)
            $table->boolean('status')->default(true)->after('name');
        });
    }

    public function down()
    {
        Schema::table('shipping_methods', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
