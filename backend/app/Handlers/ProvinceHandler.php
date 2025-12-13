<?php

namespace App\Handlers;

use App\Repositories\ProvinceRepository;

class ProvinceHandler
{
    public function __construct(private ProvinceRepository $provinces) {}

    // Listar todas las provincias.
    public function list(): array
    {
        return $this->provinces->all();
    }

    // Obtener provincia por ID.
    public function getByCity(int $cityId)
    {
        return $this->provinces->findByCityId($cityId);
    }
}
