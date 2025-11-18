<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        Customer::create([
            'company_name' => 'Empresa Ejemplo S.L.',
            'contact_name' => 'Juan Pérez',
            'email' => 'cliente@ejemplo.com',
            'phone' => '600123456'
        ]);

        Customer::create([
            'company_name' => 'Distribuciones Bella',
            'contact_name' => 'María Gómez',
            'email' => 'maria@bella.com',
            'phone' => '612345678'
        ]);
    }
}
