<?php

namespace App\Handlers;

use App\Repositories\ShippingMethodRepository;

class ShippingMethodHandler
{
    public function __construct(
        private ShippingMethodRepository $shippingMethods
    ) {}

    /**
     * Crear un método de envío.
     */
    public function create(array $data)
    {
        return $this->shippingMethods->create($data);
    }

    /**
     * Obtener método por ID.
     */
    public function get(int $id)
    {
        return $this->shippingMethods->findById($id);
    }

    /**
     * Actualizar un método de envío.
     */
    public function update(int $id, array $data)
    {
        return $this->shippingMethods->update($id, $data);
    }

    /**
     * Eliminar un método de envío.
     */
    public function delete(int $id): bool
    {
        return $this->shippingMethods->delete($id);
    }

    /**
     * Listar todos los métodos de envío.
     */
    public function list(): array
    {
        return $this->shippingMethods->all();
    }
}
