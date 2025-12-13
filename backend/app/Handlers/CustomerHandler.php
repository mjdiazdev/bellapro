<?php

namespace App\Handlers;

use App\Repositories\CustomerRepository;
use App\Repositories\PostalCodeRepository;
use Illuminate\Support\Facades\Validator;
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
            'postal_code' => 'required|string'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validar existencia del código postal
        $postalCode = $this->postalCodes->findByCode($data['postal_code']);
        if (!$postalCode) {
            throw new \Exception('Código postal no encontrado');
        }

        $data['postal_code_id'] = $postalCode->id;
        unset($data['postal_code']);

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
            'postal_code' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validar código postal si se proporciona
        if (isset($data['postal_code'])) {
            $postalCode = $this->postalCodes->findByCode($data['postal_code']);
            if (!$postalCode) throw new \Exception('Código postal no encontrado');

            $data['postal_code_id'] = $postalCode->id;
            unset($data['postal_code']);
        }

        return $this->customers->updateByEmail($email, $data);
    }

    /**
     * Eliminar un customer por NIF
     */
    public function deleteByNif(string $nif): bool
    {
        return $this->customers->deleteByNif($nif);
    }
}
