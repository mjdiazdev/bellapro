<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\Customer;

class AddressSeeder extends Seeder
{
    public function run()
    {
        $customer = Customer::first();

        Address::create([
            'customer_id' => $customer->id,
            'type' => 'billing',
            'address' => 'Calle Mayor 123',
            'city' => 'Madrid',
            'postal_code' => '28001',
            'country' => 'España'
        ]);

        Address::create([
            'customer_id' => $customer->id,
            'type' => 'shipping',
            'address' => 'Avenida del Sol 45',
            'city' => 'Madrid',
            'postal_code' => '28002',
            'country' => 'España'
        ]);
    }
}
