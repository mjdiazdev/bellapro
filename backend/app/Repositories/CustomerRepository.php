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
        return Customer::where('email', $email)->first();
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
}
