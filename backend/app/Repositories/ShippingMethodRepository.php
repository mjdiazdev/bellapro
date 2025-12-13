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
        return ShippingMethod::all()->toArray();
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

        return (bool) $method->delete();
    }
}
