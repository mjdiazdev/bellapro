<?php

namespace App\Repositories;

use App\Models\City;

class CityRepository
{
    public function all(): array
    {
        return City::all()->toArray();
    }

    public function findByPostalCode(string $postalCode): ?City
    {
        return City::whereHas('postalCodes', fn($q) => $q->where('code', $postalCode))->first();
    }

    public function findById(int $id): ?City
    {
        return City::find($id);
    }

    public function CitiesByProvince(int $provinceId): array
    {
        return City::where('province_id', $provinceId)
            ->get()
            ->toArray();
    }

}
