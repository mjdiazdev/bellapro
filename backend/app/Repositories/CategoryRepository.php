<?php
namespace App\Repositories;

use App\Models\Category;
use App\Models\Product;

class CategoryRepository
{
    /**
     * Crear categoría.
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Buscar categoría por ID.
     */
    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }

    /**
     * Buscar categoría por código.
     */
    public function findByCode(string $code): ?Category
    {
        return Category::where('code', $code)->first();
    }

    /**
     * Obtener categoría + productos por código.
     */
    public function getProductsByCode(string $code): ?array
    {
        $category = $this->findByCode($code);
        if (!$category) return null;

        return [
            'category' => $category,
            'products' => $category->products()->get(),
        ];
    }

    /**
     * Actualizar categoría.
     */
    public function update(int $id, array $data): ?Category
    {
        $category = $this->findById($id);
        if (!$category) return null;

        $category->update($data);
        return $category;
    }

    /**
     * Eliminar categoría.
     */
    public function delete(int $id): bool
    {
        $category = $this->findById($id);
        return $category ? (bool) $category->delete() : false;
    }

    /**
     * Listado de categorías.
     */
    public function all(): array
    {
        return Category::all()->toArray();
    }

    /**
     * Actualizar ruta del QR generado.
     */
    public function updateQr(int $id, string $qrPath): ?Category
    {
        $category = $this->findById($id);
        if (!$category) return null;

        $category->qr_url = $qrPath;
        $category->save();

        return $category;
    }
}
