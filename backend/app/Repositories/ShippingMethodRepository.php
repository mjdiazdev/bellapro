<?php

namespace App\Repositories;

use App\Models\ShippingMethod;

class ShippingMethodRepository
{
    /**
     * Crear un método de envío.
     */
    public function create(array $data): ShippingMethod
    {
        return ShippingMethod::create($data);
    }

    /**
     * Buscar método por ID.
     */
    public function findById(int $id): ?ShippingMethod
    {
        return ShippingMethod::find($id);
    }

    /**
     * Obtener todos los métodos de envío.
     */
    public function all(): array
    {
        // Solo devolvemos los registros donde status sea true (1)
        return ShippingMethod::where('status', true)
            ->orderBy('name', 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Actualizar un método de envío.
     */
    public function update(int $id, array $data): ?ShippingMethod
    {
        $method = $this->findById($id);
        if (!$method) return null;

        $method->update($data);
        return $method;
    }

    /**
     * Eliminar un método de envío.
     */
    public function delete(int $id): bool
    {
        $method = $this->findById($id);
        if (!$method) return false;

        // En lugar de $method->delete(), actualizamos el status
        $method->status = false;
        return (bool) $method->save();
    }

    /**
     * Verificar si el método de envio posee ordener
     */
    public function hasOrders(int $id): bool
    {
        return \App\Models\DistributionCenterShippingMethod::where('shipping_method_id', $id)
            ->whereHas('orders')
            ->exists();
    }
}
