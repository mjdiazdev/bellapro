<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostalCode;
use App\Models\City;

/**
 * Seeder para poblar códigos postales de España,
 * con varios códigos por ciudad para mayor realismo.
 */
class PostalCodeSeeder extends Seeder
{
    public function run(): void
    {
        $cities = City::all()->keyBy('name');

        $postalCodes = [
            // Madrid
            ['code' => '28001', 'city_id' => $cities['Madrid']->id],
            ['code' => '28002', 'city_id' => $cities['Madrid']->id],
            ['code' => '28003', 'city_id' => $cities['Madrid']->id],
            ['code' => '28801', 'city_id' => $cities['Alcalá de Henares']->id],
            ['code' => '28802', 'city_id' => $cities['Alcalá de Henares']->id],

            // Barcelona
            ['code' => '08001', 'city_id' => $cities['Barcelona']->id],
            ['code' => '08002', 'city_id' => $cities['Barcelona']->id],
            ['code' => '08901', 'city_id' => $cities['Hospitalet']->id],
            ['code' => '08902', 'city_id' => $cities['Hospitalet']->id],

            // Sevilla
            ['code' => '41001', 'city_id' => $cities['Sevilla']->id],
            ['code' => '41002', 'city_id' => $cities['Sevilla']->id],
            ['code' => '41400', 'city_id' => $cities['Dos Hermanas']->id],
            ['code' => '41410', 'city_id' => $cities['Dos Hermanas']->id],

            // Málaga
            ['code' => '29001', 'city_id' => $cities['Málaga']->id],
            ['code' => '29002', 'city_id' => $cities['Málaga']->id],
            ['code' => '29600', 'city_id' => $cities['Marbella']->id],
            ['code' => '29601', 'city_id' => $cities['Marbella']->id],

            // Valencia
            ['code' => '46001', 'city_id' => $cities['Valencia']->id],
            ['code' => '46002', 'city_id' => $cities['Valencia']->id],
            ['code' => '46700', 'city_id' => $cities['Gandía']->id],
            ['code' => '46701', 'city_id' => $cities['Gandía']->id],
        ];

        foreach ($postalCodes as $postalCode) {
            PostalCode::create($postalCode);
        }
    }
}
