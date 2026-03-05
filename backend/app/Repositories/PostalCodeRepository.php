<?php

namespace App\Repositories;

use App\Models\PostalCode;

class PostalCodeRepository
{
    public function all(): array
    {
        return PostalCode::all()->toArray();
    }

    public function findByCode(string $code): ?PostalCode
    {
        return PostalCode::where('code', $code)->first();
    }

    public function PostalCodesByCity(int $cityId): array
    {
        return PostalCode::where('city_id', $cityId)
            ->get()
            ->toArray();
    }

    public function findById(int $id): ?PostalCode
    {
        return PostalCode::find($id);
    }

    public function findByCodeWithLocation(string $code): ?PostalCode
    {
        // Usamos eager loading para traer la ciudad y la provincia en una sola consulta
        return PostalCode::where('code', $code)
            ->with(['city.province'])
            ->first();
    }
}
