<?php

namespace App\Handlers;

use App\Repositories\CustomerRepository;
use App\Repositories\PostalCodeRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Handler para la lógica de negocio de los clientes
 */
class CustomerHandler
{
    public function __construct(
        private CustomerRepository $customers,
        private PostalCodeRepository $postalCodes
    ) {}

    /**
     * Crear un nuevo customer
     */
    public function create(array $data)
    {
        // Validación de campos
        $validator = Validator::make($data, [
            'nif' => 'required|string|unique:customers,nif',
            'email' => 'required|email|unique:customers,email',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'address_extra' => 'nullable|string|max:255',
            'postal_code_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validar existencia del código postal
        $postalCode = $this->postalCodes->findById($data['postal_code_id']);
        if (!$postalCode) {
            throw new \Exception('Código postal no encontrado');
        }

        return $this->customers->create($data);
    }

    /**
     * Obtener customer por email
     */
    public function getByEmail(string $email)
    {
        return $this->customers->findByEmail($email);
    }

    /**
     * Listar todos los customers
     */
    public function list(): array
    {
        return $this->customers->all();
    }

    /**
     * Actualizar un customer por email
     */
    public function updateByEmail(string $email, array $data)
    {
        // Validación de campos
        $validator = Validator::make($data, [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'address_extra' => 'nullable|string|max:255',
            'postal_code_id' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validar código postal si se proporciona
        if (isset($data['postal_code_id'])) {
            $postalCode = $this->postalCodes->findById($data['postal_code_id']);
            if (!$postalCode) throw new \Exception('Código postal no encontrado');
        }

        return $this->customers->updateByEmail($email, $data);
    }

    /**
     * Obtener un customer por su ID
     */
    public function findById(int $id)
    {
        return $this->customers->findById($id);
    }

    /**
     * Eliminar customer por ID
     */
    public function deleteById(int $id): bool
    {
        $customer = $this->customers->findById($id);

        if (!$customer) {
            return false;
        }

        // No borrar clientes con historial de compras
        if ($customer->orders()->exists()) {
            throw new \Exception("No se puede eliminar al cliente '{$customer->name}' porque tiene pedidos registrados en el sistema.");
        }

        return $this->customers->deleteById($id);
    }

    /**
     * Actualizar customer por ID
     */
    public function updateById(int $id, array $data)
    {
        // Validación de campos
        $validator = Validator::make($data, [
            'nif' => [
                'sometimes',
                'string',
                Rule::unique('customers', 'nif')->ignore($id)
            ],
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('customers', 'email')->ignore($id)
            ],
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'address_extra' => 'nullable|string|max:255',
            'postal_code_id' => 'sometimes|integer|exists:postal_codes,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        return $this->customers->updateById($id, $data);
    }
}
