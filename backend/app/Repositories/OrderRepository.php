<?php

namespace App\Repositories;

use App\Models\Order;

class OrderRepository
{
    /**
     * Crear una orden
     */
    public function create(array $data): Order
    {
        return Order::create($data);
    }

    /**
     * Obtener una orden por ID con relaciones
     */
    public function findById(int $id): ?Order
    {
        return Order::with([
            'customer',
            'postalCode.city.province',
            'distributionCenterMethod.shippingMethod',
            'distributionCenterMethod.distributionCenter',
            'items.product'
        ])->find($id);
    }

    /**
     * Obtener todas las órdenes con relaciones
     */
    public function all()
    {
        return Order::with([
            'customer',
            'postalCode.city.province',
            'distributionCenterMethod.shippingMethod',
            'items.product'
        ])->orderByDesc('id')->get();
    }
}
