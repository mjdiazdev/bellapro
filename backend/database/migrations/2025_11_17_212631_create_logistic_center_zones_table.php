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
        Schema::create('logistic_center_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('logistic_center_id')->constrained()->onDelete('cascade');
            $table->string('postal_code');
            $table->enum('type', ['assigned', 'near']); // asignado o cercano
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logistic_center_zones');
    }
};
