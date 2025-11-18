<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LogisticCenter;

class LogisticCenterSeeder extends Seeder
{
    public function run()
    {
        LogisticCenter::create([
            'name' => 'Centro Madrid',
            'address' => 'Calle Logística 10',
            'city' => 'Madrid',
            'postal_code' => '28050',
            'contact_email' => 'madrid-center@bellapro.com'
        ]);

        LogisticCenter::create([
            'name' => 'Centro Barcelona',
            'address' => 'Carrer Industria 22',
            'city' => 'Barcelona',
            'postal_code' => '08030',
            'contact_email' => 'bcn-center@bellapro.com'
        ]);
    }
}
