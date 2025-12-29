<?php

namespace App\Handlers;

use App\Repositories\DistributionCenterRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DistributionCenterHandler
{
    public function __construct(
        private DistributionCenterRepository $repository
    ) {}

    /**
     * Validar y crear un nuevo centro de distribución.
     */
    public function create(array $data)
    {
        $validator = Validator::make($data, [
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:distribution_centers,email',
            'phone'          => 'required|string|max:20',
            'address'        => 'required|string|max:255',
            'postal_code_id' => 'required|integer|exists:postal_codes,id'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return DB::transaction(function () use ($data) {
            $center = $this->repository->create($data);

            // Asociar métodos de envío si vienen en el request
            if (isset($data['shipping_methods']) && is_array($data['shipping_methods'])) {
                $center->shippingMethods()->sync($data['shipping_methods']);
            }

            return $center->load('shippingMethods');
        });
    }

    /**
     * Actualizar centro con validaciones.
     */
    public function update(int $id, array $data)
    {
        $validator = Validator::make($data, [
            'name'           => 'sometimes|string|max:255',
            'email'          => "sometimes|email|unique:distribution_centers,email,$id",
            'phone'          => 'sometimes|string|max:20',
            'address'        => 'sometimes|string|max:255',
            'postal_code_id' => 'sometimes|integer|exists:postal_codes,id'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return DB::transaction(function () use ($id, $data) {
            $center = $this->repository->update($id, $data);

            if (!$center) throw new \Exception("Centro no encontrado");

            // Sincronizar métodos de envío
            if (isset($data['shipping_methods']) && is_array($data['shipping_methods'])) {
                $center->shippingMethods()->sync($data['shipping_methods']);
            }

            return $center->load('shippingMethods');
        });
    }

    public function get(int $id)
    {
        return $this->repository->findById($id);
    }

    public function list()
    {
        return $this->repository->all();
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
