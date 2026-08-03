<?php
namespace App\Repositories;

use App\Models\Product;

/**
 * Repository para manejar consultas de productos a la BD.
 */
class ProductRepository
{
    /**
     * Crear un producto.
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Buscar producto por ID.
     */
    public function findById(int $id): ?Product
    {
        // Agregamos 'stock' para que el modal de detalles en React tenga la info
        return Product::with(['category', 'stock'])->find($id);
    }

    /**
     * Obtener productos por categoría.
     */
    public function findByCategoryId(int $categoryId): array
    {
        return Product::where('category_id', $categoryId)->get()->toArray();
    }

    /**
     * Actualizar producto.
     */
    public function update(int $id, array $data): ?Product
    {
        $product = $this->findById($id);
        if (!$product) return null;

        $product->update($data);
        return $product;
    }

    /**
     * Eliminar producto.
     */
    public function delete(int $id): bool
    {
        $product = $this->findById($id);
        if (!$product) return false;

        return (bool) $product->delete();
    }

    /**
     * Listar todos los productos, con búsqueda opcional por nombre o referencia.
     */
    public function all(int $perPage = 25, ?string $search = null)
    {
        // Usamos paginate para que Laravel gestione la metadata (total, current_page, etc.)
        return Product::with(['category', 'stock'])
            ->when($search, fn($query) => $query->where(
                fn($subQuery) => $subQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
            ))
            ->paginate($perPage);
    }
}
