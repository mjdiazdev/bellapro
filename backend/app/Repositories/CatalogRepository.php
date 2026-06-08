<?php

namespace App\Repositories;

use App\Models\Catalog;
use Illuminate\Database\Eloquent\Collection;

class CatalogRepository
{
    public function all(): Collection
    {
        return Catalog::orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function active(): Collection
    {
        return Catalog::where('active', true)->orderBy('order')->orderBy('created_at', 'desc')->get();
    }

    public function find(int $id): ?Catalog
    {
        return Catalog::find($id);
    }

    public function create(array $data): Catalog
    {
        return Catalog::create($data);
    }

    public function update(Catalog $catalog, array $data): Catalog
    {
        $catalog->update($data);
        return $catalog->fresh();
    }

    public function deactivateAllExcept(?int $exceptId): void
    {
        $query = Catalog::where('active', true);
        if ($exceptId !== null) {
            $query->where('id', '!=', $exceptId);
        }
        $query->update(['active' => false]);
    }

    public function delete(Catalog $catalog): void
    {
        $catalog->delete();
    }
}
