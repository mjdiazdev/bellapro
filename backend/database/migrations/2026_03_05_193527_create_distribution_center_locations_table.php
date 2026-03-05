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
        Schema::create('distribution_center_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_center_id')->constrained()->onDelete('cascade');
            $table->foreignId('postal_code_id')->constrained();
            $table->string('address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribution_center_locations');
    }
};
