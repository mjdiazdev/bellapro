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
}
