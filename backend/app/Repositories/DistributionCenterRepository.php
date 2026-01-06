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

    /**
     * Buscar el centro de distribución más cercano según el código postal (CP).
     */
    public function findNearestCenter(string $postalCode): ?DistributionCenter
    {
        // 1. Obtener la ubicación geográfica de referencia basada en el CP proporcionado por el usuario
        $reference = \App\Models\PostalCode::with('city.province')
            ->where('code', $postalCode)
            ->first();

        // Si el CP no existe en nuestra base de datos, retornamos el primer centro disponible por defecto
        if (!$reference) {
            return DistributionCenter::with('shippingMethods')->first();
        }

        // Variables de comparación para la consulta jerárquica
        $cityId = $reference->city_id;
        $provinceId = $reference->city->province_id;
        $targetInt = (int) $postalCode; // Casteo a entero para cálculo de diferencia absoluta

        return DistributionCenter::join('postal_codes', 'distribution_centers.postal_code_id', '=', 'postal_codes.id')
            ->join('cities', 'postal_codes.city_id', '=', 'cities.id')
            ->select('distribution_centers.*')
            // Cargamos shippingMethods incluyendo el ID de la tabla pivote (dist_center_shipping_method)
            ->with(['shippingMethods' => function($query) {
                $query->select('shipping_methods.*');
            }])
            ->orderByRaw("
                CASE
                    /* Prioridad 1: Centros cuya ciudad coincida exactamente.
                       Prioridad 2: Centros cuya provincia coincida.
                       Prioridad 3: Cualquier otro centro (ordenado por cercanía numérica).
                    */
                    WHEN cities.id = ? THEN 1
                    WHEN cities.province_id = ? THEN 2
                    ELSE 3
                END ASC,
                /* Criterio de desempate o aproximación final:
                   Calculamos la diferencia absoluta entre los códigos postales.
                   Ej: Si el cliente es 3004 y hay centros 3000 y 3030, ganará el 3000 (|3000-3004|=4).
                */
                ABS(CAST(postal_codes.code AS SIGNED) - ?) ASC
            ", [$cityId, $provinceId, $targetInt])
            // Solo necesitamos el centro que mejor cumpla las condiciones anteriores
            ->first();
    }
}
