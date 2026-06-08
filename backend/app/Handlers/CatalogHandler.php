<?php

namespace App\Handlers;

use App\Models\Catalog;
use App\Repositories\CatalogRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CatalogHandler
{
    public function __construct(private CatalogRepository $catalogs) {}

    public function listAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->catalogs->all();
    }

    public function listActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->catalogs->active();
    }

    public function create(array $data, UploadedFile $file): Catalog
    {
        $filename  = Str::uuid() . '.pdf';
        $file->storeAs('catalogs', $filename, 'public');

        $isActive = isset($data['active']) ? filter_var($data['active'], FILTER_VALIDATE_BOOLEAN) : true;

        // Solo puede haber un catálogo activo a la vez
        if ($isActive) {
            $this->catalogs->deactivateAllExcept(null);
        }

        return $this->catalogs->create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'file_path'   => $filename,
            'active'      => $isActive,
            'order'       => $data['order'] ?? 0,
        ]);
    }

    public function update(int $id, array $data, ?UploadedFile $file = null): Catalog
    {
        $catalog = $this->catalogs->find($id);
        if (!$catalog) {
            throw new \Exception('Catálogo no encontrado');
        }

        $newActive = isset($data['active'])
            ? filter_var($data['active'], FILTER_VALIDATE_BOOLEAN)
            : $catalog->active;

        // Solo puede haber un catálogo activo a la vez
        if ($newActive) {
            $this->catalogs->deactivateAllExcept($id);
        }

        $updateData = [
            'name'        => $data['name'] ?? $catalog->name,
            'description' => $data['description'] ?? $catalog->description,
            'active'      => $newActive,
            'order'       => $data['order'] ?? $catalog->order,
        ];

        if ($file) {
            Storage::disk('public')->delete('catalogs/' . $catalog->file_path);
            $filename                = Str::uuid() . '.pdf';
            $file->storeAs('catalogs', $filename, 'public');
            $updateData['file_path'] = $filename;
        }

        return $this->catalogs->update($catalog, $updateData);
    }

    public function delete(int $id): void
    {
        $catalog = $this->catalogs->find($id);
        if (!$catalog) {
            throw new \Exception('Catálogo no encontrado');
        }

        Storage::disk('public')->delete('catalogs/' . $catalog->file_path);
        $this->catalogs->delete($catalog);
    }

    public function download(int $id): array
    {
        $catalog = $this->catalogs->find($id);
        if (!$catalog || !$catalog->active) {
            throw new \Exception('Catálogo no disponible');
        }

        $path = storage_path('app/public/catalogs/' . $catalog->file_path);
        if (!file_exists($path)) {
            throw new \Exception('Archivo no encontrado');
        }

        return ['path' => $path, 'name' => $catalog->name . '.pdf'];
    }
}
