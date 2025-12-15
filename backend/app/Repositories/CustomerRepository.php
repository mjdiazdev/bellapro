<?php

namespace App\Repositories;

use App\Models\Customer;

/**
 * Repositorio para manejar la persistencia de datos de los clientes.
 */
class CustomerRepository
{
    /**
     * Crear un nuevo customer
     */
    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    /**
     * Obtener un customer por su NIF
     */
    public function findByNif(string $nif): ?Customer
    {
        return Customer::where('nif', $nif)->first();
    }

    /**
     * Obtener un customer por su email
     */
    public function findByEmail(string $email): ?Customer
    {
        return Customer::with([
            'postalCode.city.province' // Trae postalCode -> city -> province
        ])->find(Customer::where('email', $email)->value('id'));
    }

    /**
     * Obtener todos los customers
     */
    public function all(): array
    {
        return Customer::all()->toArray();
    }

    /**
     * Actualizar customer por email
     */
    public function updateByEmail(string $email, array $data): ?Customer
    {
        $customer = $this->findByEmail($email);
        if (!$customer) return null;

        $customer->update($data);
        return $customer;
    }

    /**
     * Eliminar customer por NIF
     */
    public function deleteByNif(string $nif): bool
    {
        $customer = $this->findByNif($nif);
        if (!$customer) return false;

        return (bool) $customer->delete();
    }

    /**
     * Obtener un customer por su ID
     */
    public function findById(int $id): ?Customer
    {
        return Customer::with([
            'postalCode.city.province' // Trae postalCode -> city -> province
        ])->find($id);
    }


    /**
     * Eliminar customer por ID
     */
    public function deleteById(int $id): bool
    {
        $customer = $this->findById($id);
        if (!$customer) return false;

        return (bool) $customer->delete();
    }

    /**
     * Actualizar customer por ID
     */
    public function updateById(int $id, array $data): ?Customer
    {
        $customer = $this->findById($id);
        if (!$customer) return null;

        $customer->update($data);
        return $customer;
    }
}
