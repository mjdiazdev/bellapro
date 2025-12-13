<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Creacion de los roles iniciales
        $this->call([
            RoleSeeder::class,
            ShippingMethodSeeder::class,
            ProvinceSeeder::class,
            CitySeeder::class,
            PostalCodeSeeder::class,
        ]);

        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('123456')
        ])->assignRole('admin');




    }
}
