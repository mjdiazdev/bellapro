<?php

namespace App\Repositories;

use App\Models\DistributionCenter;

/**
 * Repository para manejar consultas de Centros de Distribución.
 */
class DistributionCenterRepository
{
    /**
     * Crear un centro de distribución.
     */
    public function create(array $data): DistributionCenter
    {
        return DistributionCenter::create($data);
    }

    /**
     * Buscar centro por ID con su código postal y ciudad.
     */
    public function findById(int $id): ?DistributionCenter
    {
        // Cargamos shippingMethods para que el frontend sepa cuáles están activos
        return DistributionCenter::with(['postalCode.city.province', 'shippingMethods'])->find($id);
    }

    /**
     * Actualizar datos del centro.
     */
    public function update(int $id, array $data): ?DistributionCenter
    {
        $center = DistributionCenter::find($id);
        if (!$center) return null;

        $center->update($data);
        return $center;
    }

    /**
     * Eliminar un centro.
     */
    public function delete(int $id): bool
    {
        $center = DistributionCenter::find($id);
        if (!$center) return false;

        return (bool) $center->delete();
    }

    /**
     * Listar todos los centros con sus relaciones geográficas.
     */
    public function all(): array
    {
        return DistributionCenter::with(['postalCode.city.province', 'shippingMethods'])->get()->toArray();
    }
}
