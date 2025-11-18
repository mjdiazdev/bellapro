<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['reference' => '140070001', 'name' => 'C.T.T. DIA COLOR 60ml 1',      'price_without_tax' => 8.22],
            ['reference' => '140070003', 'name' => 'C.T.T. DIA COLOR 60ml 3',      'price_without_tax' => 8.22],
            ['reference' => '140070004', 'name' => 'C.T.T. DIA COLOR 60ml 4',      'price_without_tax' => 8.22],
            ['reference' => '140070005', 'name' => 'C.T.T. DIA COLOR 60ml 5',      'price_without_tax' => 8.22],
            ['reference' => '140070006', 'name' => 'C.T.T. DIA COLOR 60ml 6',      'price_without_tax' => 8.22],
            ['reference' => '140070007', 'name' => 'C.T.T. DIA COLOR 60ml 7',      'price_without_tax' => 8.22],
            ['reference' => '140070008', 'name' => 'C.T.T. DIA COLOR 60ml 8',      'price_without_tax' => 8.22],
            ['reference' => '140070009', 'name' => 'C.T.T. DIA COLOR 60ml 9',      'price_without_tax' => 8.22],
            ['reference' => '140071999', 'name' => 'C.T.T. DIA LIGHT 250ml CLEAR', 'price_without_tax' => 23.55],
            ['reference' => '140070412', 'name' => 'C.T.T. DIA COLOR 60ml 4.12',   'price_without_tax' => 8.22],
            ['reference' => '140070051', 'name' => 'C.T.T. DIA COLOR 60ml 5.1',    'price_without_tax' => 8.22],
            ['reference' => '140070518', 'name' => 'C.T.T. DIA COLOR 60ml 5.18',   'price_without_tax' => 8.22],
            ['reference' => '140070061', 'name' => 'C.T.T. DIA COLOR 60ml 6.1',    'price_without_tax' => 8.22],
            ['reference' => '140070612', 'name' => 'C.T.T. DIA COLOR 60ml 6.12',   'price_without_tax' => 8.22],
            ['reference' => '140070071', 'name' => 'C.T.T. DIA COLOR 60ml 7.1',    'price_without_tax' => 8.22],
            ['reference' => '140070718', 'name' => 'C.T.T. DIA COLOR 60ml 7.18',   'price_without_tax' => 8.22],
            ['reference' => '140070081', 'name' => 'C.T.T. DIA COLOR 60ml 8.1',    'price_without_tax' => 8.22],
            ['reference' => '140070058', 'name' => 'C.T.T. DIA COLOR 60ml 5.8',    'price_without_tax' => 8.22],
            ['reference' => '140070068', 'name' => 'C.T.T. DIA COLOR 60ml 6.8',    'price_without_tax' => 8.22],
            ['reference' => '140070684', 'name' => 'C.T.T. DIA COLOR 60ml 6.84',   'price_without_tax' => 8.22],
            ['reference' => '140070078', 'name' => 'C.T.T. DIA COLOR 60ml 7.8',    'price_without_tax' => 8.22],
            ['reference' => '140070982', 'name' => 'C.T.T. DIA COLOR 60ml 9.82',   'price_without_tax' => 8.22],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate(
                ['reference' => $p['reference']],
                [
                    'name' => $p['name'],
                    'description' => $p['name'],
                    'price_without_tax' => $p['price_without_tax']
                ]
            );
        }
    }
}
