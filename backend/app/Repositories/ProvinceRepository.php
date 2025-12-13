<?php

namespace App\Repositories;

use App\Models\Province;

class ProvinceRepository
{
    public function all(): array
    {
        return Province::all()->toArray();
    }

    public function findById(int $id): ?Province
    {
        return Province::find($id);
    }

    public function findByCityId(int $cityId): ?Province
    {
        return Province::whereHas('cities', fn($q) => $q->where('id', $cityId))->first();
    }
}
