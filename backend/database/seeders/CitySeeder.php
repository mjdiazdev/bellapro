<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Province;

/**
 * Seeder para poblar ciudades de España,
 * asociadas a sus provincias.
 */
class CitySeeder extends Seeder
{
    public function run(): void
    {
        $provinces = Province::all()->keyBy('name');

        $cities = [
            // Madrid
            ['name' => 'Madrid', 'province_id' => $provinces['Madrid']->id],
            ['name' => 'Alcalá de Henares', 'province_id' => $provinces['Madrid']->id],

            // Barcelona
            ['name' => 'Barcelona', 'province_id' => $provinces['Barcelona']->id],
            ['name' => 'Hospitalet', 'province_id' => $provinces['Barcelona']->id],

            // Sevilla
            ['name' => 'Sevilla', 'province_id' => $provinces['Sevilla']->id],
            ['name' => 'Dos Hermanas', 'province_id' => $provinces['Sevilla']->id],

            // Málaga
            ['name' => 'Málaga', 'province_id' => $provinces['Málaga']->id],
            ['name' => 'Marbella', 'province_id' => $provinces['Málaga']->id],

            // Valencia
            ['name' => 'Valencia', 'province_id' => $provinces['Valencia']->id],
            ['name' => 'Gandía', 'province_id' => $provinces['Valencia']->id],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
