<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QrCode;
use App\Models\Product;

class QrSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            $qr = QrCode::create([
                'code' => 'QR-' . str_pad($i, 4, '0', STR_PAD_LEFT)
            ]);

            // Asociar entre 1 y 5 productos aleatorios
            $qr->products()->attach(
                Product::inRandomOrder()->take(rand(1, 5))->pluck('id')
            );
        }
    }
}
