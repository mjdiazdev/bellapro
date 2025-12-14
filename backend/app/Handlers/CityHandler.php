<?php

namespace App\Handlers;

use App\Repositories\CityRepository;

class CityHandler
{
    public function __construct(private CityRepository $cities) {}

    // Listar todas las ciudades.
    public function list(): array
    {
        return $this->cities->all();
    }

    // Obtener ciudad por código postal.
    public function getByPostalCode(string $postalCode)
    {
        return $this->cities->findByPostalCode($postalCode);
    }

    // Obtener ciudades por provincia.
    public function getByProvince(int $provinceId): array
    {
        return $this->cities->CitiesByProvince($provinceId);
    }
}
