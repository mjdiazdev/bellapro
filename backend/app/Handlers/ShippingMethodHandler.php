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
        $method = $this->shippingMethods->findById($id);

        if (!$method) return false;

        // Preguntamos al repositorio si hay pedidos (Lógica de BD encapsulada)
        if ($this->shippingMethods->hasOrders($id)) {
            throw new \Exception("No se puede eliminar el método '{$method->name}' porque tiene pedidos históricos asociados.");
        }

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
