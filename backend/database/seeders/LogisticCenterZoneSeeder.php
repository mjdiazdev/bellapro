<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LogisticCenter;
use App\Models\LogisticCenterZone;

class LogisticCenterZoneSeeder extends Seeder
{
    public function run()
    {
        $madrid = LogisticCenter::where('name', 'Centro Madrid')->first();
        $barcelona = LogisticCenter::where('name', 'Centro Barcelona')->first();

        // Asignados
        LogisticCenterZone::create([
            'logistic_center_id' => $madrid->id,
            'postal_code' => '28001',
            'type' => 'assigned'
        ]);

        LogisticCenterZone::create([
            'logistic_center_id' => $madrid->id,
            'postal_code' => '28002',
            'type' => 'assigned'
        ]);

        // Cercanos
        LogisticCenterZone::create([
            'logistic_center_id' => $barcelona->id,
            'postal_code' => '08031',
            'type' => 'near'
        ]);
    }
}
