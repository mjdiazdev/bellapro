<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;

/**
 * Seeder para poblar las provincias de España.
 */
class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['name' => 'Madrid', 'code' => '28'],
            ['name' => 'Barcelona', 'code' => '08'],
            ['name' => 'Sevilla', 'code' => '41'],
            ['name' => 'Málaga', 'code' => '29'],
            ['name' => 'Valencia', 'code' => '46'],
        ];

        foreach ($provinces as $province) {
            Province::create($province);
        }
    }
}
