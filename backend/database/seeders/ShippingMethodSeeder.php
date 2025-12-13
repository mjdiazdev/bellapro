<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingMethod;

/**
 * Seeder para poblar la tabla shipping_methods con
 * métodos de envío básicos del sistema.
 */
class ShippingMethodSeeder extends Seeder
{
    /**
     * Ejecuta el seeder.
     */
    public function run(): void
    {
        $methods = [
            [
                'name'        => 'Envío Estándar',
                'description' => 'Entrega de 3 a 5 días hábiles.',
                'price'       => 4.99
            ],
            [
                'name'        => 'Envío Express',
                'description' => 'Entrega en 24 a 48 horas.',
                'price'       => 9.99
            ],
            [
                'name'        => 'Envío Gratuito',
                'description' => 'Disponible para compras superiores a $50.',
                'price'       => 0
            ]
        ];

        // Crear cada método de envío en la base de datos
        foreach ($methods as $method) {
            ShippingMethod::create($method);
        }
    }
}
