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
    public function hasOrders(int $id): bool
    {
        // Verificamos si algún registro de la tabla pivote que pertenece a este centro
        // tiene órdenes asociadas.
        return \App\Models\DistributionCenterShippingMethod::where('distribution_center_id', $id)
            ->whereHas('orders')
            ->exists();
    }

    public function delete(int $id): bool
    {
        $center = $this->findById($id);
        return $center ? (bool) $center->delete() : false;
    }

    /**
     * Listar todos los centros con sus relaciones geográficas.
     */
    public function all(): array
    {
        return DistributionCenter::with(['postalCode.city.province', 'shippingMethods'])->get()->toArray();
    }

    /**
     * Buscar el centro de distribución más cercano según el código postal (CP).
     */
    public function findNearestCenter(string $postalCode): ?DistributionCenter
    {
        // 1. Obtener la ubicación geográfica de referencia
        $reference = \App\Models\PostalCode::with('city.province')
            ->where('code', $postalCode)
            ->first();

        // Si el CP no existe, retornamos el primer centro con sus métodos ACTIVOS
        if (!$reference) {
            return DistributionCenter::with(['shippingMethods' => function($query) {
                $query->where('shipping_methods.status', true); // Filtro de activos
            }])->first();
        }

        $cityId = $reference->city_id;
        $provinceId = $reference->city->province_id;
        $targetInt = (int) $postalCode;

        return DistributionCenter::join('postal_codes', 'distribution_centers.postal_code_id', '=', 'postal_codes.id')
            ->join('cities', 'postal_codes.city_id', '=', 'cities.id')
            ->select('distribution_centers.*')
            // CARGA CON FILTRO: Solo métodos de envío donde status sea true
            ->with(['shippingMethods' => function($query) {
                $query->where('shipping_methods.status', true);
            }])
            ->orderByRaw("
                CASE
                    WHEN cities.id = ? THEN 1
                    WHEN cities.province_id = ? THEN 2
                    ELSE 3
                END ASC,
                ABS(CAST(postal_codes.code AS SIGNED) - ?) ASC
            ", [$cityId, $provinceId, $targetInt])
            ->first();
    }
}
