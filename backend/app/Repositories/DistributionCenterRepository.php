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
        // Creamos el centro con los datos básicos
        $center = DistributionCenter::create([
            'name'  => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'user_id' => $data['user_id'],
        ]);

        // Guardamos las múltiples ubicaciones
        if (isset($data['locations']) && is_array($data['locations'])) {
            foreach ($data['locations'] as $location) {
                $center->locations()->create([
                    'postal_code_id' => $location['postal_code_id'],
                    'address'        => $location['address']
                ]);
            }
        }
        return $center;
    }

    /**
     * Buscar centro por ID con su código postal y ciudad.
     */
    public function findById(int $id): ?DistributionCenter
    {
        // Cambiamos 'postalCode' por 'locations.postalCode.city.province'
        return DistributionCenter::with([
            'locations.postalCode.city.province',
            'shippingMethods'
        ])->find($id);
    }

    /**
     * Actualizar datos del centro.
     */
    public function update(int $id, array $data): ?DistributionCenter
    {
        $center = DistributionCenter::find($id);
        if (!$center) return null;

        // Actualizar datos básicos (Nombre, Email, Teléfono)
        $center->update([
            'name'  => $data['name'] ?? $center->name,
            'email' => $data['email'] ?? $center->email,
            'phone' => $data['phone'] ?? $center->phone,
            'user_id' => $data['user_id'] ?? $center->user_id,
        ]);

        // Sincronizar ubicaciones: eliminamos las actuales y creamos las nuevas
        if (isset($data['locations']) && is_array($data['locations'])) {
            $center->locations()->delete();
            foreach ($data['locations'] as $location) {
                $center->locations()->create([
                    'postal_code_id' => $location['postal_code_id'],
                    'address'        => $location['address']
                ]);
            }
        }

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
        return DistributionCenter::with([
            'coordinator', // <--- Agregamos esto para los datos del encargado
            'locations.postalCode.city.province',
            'shippingMethods'
        ])->get()->toArray();
    }

    /**
     * Verificar si un código postal está directamente asignado a algún centro de distribución.
     * Solo el CP exacto cuenta — ciudad/provincia NO son suficientes.
     */
    public function isPostalCodeDirectlyCovered(string $postalCode): bool
    {
        $postalCodeModel = \App\Models\PostalCode::where('code', $postalCode)->first();
        if (!$postalCodeModel) return false;

        return \App\Models\DistributionCenterLocation::where('postal_code_id', $postalCodeModel->id)->exists();
    }

    /**
     * Devolver los métodos de envío por defecto cuando el CP no tiene cobertura directa.
     * Solo se devuelve Envío Estándar — el Ultrarrápido/Express requiere centro asignado.
     *
     * Se carga a través de la relación BelongsToMany para que el pivot.id esté disponible
     * en el frontend (necesario para dist_center_shipping_method_id al crear la orden).
     */
    public function getDefaultShippingMethods(): \Illuminate\Database\Eloquent\Collection
    {
        $center = DistributionCenter::whereHas('shippingMethods', function ($q) {
            $q->where('shipping_methods.name', 'Envío Estándar')
              ->where('shipping_methods.status', true);
        })->first();

        if (!$center) {
            return collect();
        }

        return $center->shippingMethods()
            ->where('shipping_methods.name', 'Envío Estándar')
            ->where('shipping_methods.status', true)
            ->get();
    }

    /**
     * Buscar el centro de distribución más cercano según el código postal (CP).
     */
    public function findNearestCenter(string $postalCode): ?DistributionCenter
    {
        // 1. Obtener la ubicación geográfica de referencia (el CP que mete el cliente)
        $reference = \App\Models\PostalCode::with('city.province')
            ->where('code', $postalCode)
            ->first();

        // Si el CP no existe en la DB no hay cobertura — el handler decide qué mostrar
        if (!$reference) {
            return null;
        }

        $cityId = $reference->city_id;
        $provinceId = $reference->city->province_id;
        $targetInt = (int) $postalCode;

        return DistributionCenter::select('distribution_centers.*')
            // Unimos con la nueva tabla de ubicaciones
            ->join('distribution_center_locations', 'distribution_centers.id', '=', 'distribution_center_locations.distribution_center_id')
            ->join('postal_codes', 'distribution_center_locations.postal_code_id', '=', 'postal_codes.id')
            ->join('cities', 'postal_codes.city_id', '=', 'cities.id')
            ->with(['shippingMethods' => function($query) {
                $query->where('shipping_methods.status', true);
            }])
            ->orderByRaw("
                CASE
                    -- Prioridad 1: El centro tiene EXACTAMENTE este CP asignado
                    WHEN postal_codes.code = ? THEN 1
                    -- Prioridad 2: El centro tiene ubicaciones en la misma CIUDAD
                    WHEN cities.id = ? THEN 2
                    -- Prioridad 3: El centro tiene ubicaciones en la misma PROVINCIA
                    WHEN cities.province_id = ? THEN 3
                    ELSE 4
                END ASC,
                -- Desempate por cercanía numérica de CP
                ABS(CAST(postal_codes.code AS SIGNED) - ?) ASC
            ", [$postalCode, $cityId, $provinceId, $targetInt])
            ->first();
    }
}
