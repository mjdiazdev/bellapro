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
    public function all($perPage = 25, $user = null)
    {
        $query = Order::with([
            'customer',
            'postalCode.city.province',
            'distributionCenterMethod.shippingMethod',
            'items.product'
        ]);

        // Lógica de filtrado por rol
        if ($user && $user->hasRole('coordinador')) {
            // Obtenemos los IDs de los centros asignados a este usuario
            $centerIds = $user->distributionCenters()->pluck('id')->toArray();

            $query->whereHas('distributionCenterMethod', function ($q) use ($centerIds) {
                $q->whereIn('distribution_center_id', $centerIds);
            });
        }

        return $query->orderByDesc('id')->paginate($perPage);
    }

    public function updateStatusBulk(array $ids, string $status): bool
    {
        // Usamos whereIn para que la actualización sea una sola sentencia SQL
        return Order::whereIn('id', $ids)->update(['status' => $status]);
    }
}
