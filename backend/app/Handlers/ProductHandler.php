<?php
namespace App\Handlers;

use Illuminate\Support\Facades\Validator;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;

class ProductHandler
{
    public function __construct(
        private ProductRepository $products,
        private CategoryRepository $categories
    ) {}

    /**
     * Crear un producto con validaciones.
     */
    public function create(array $data)
    {
        // Validaciones completas
        $validator = Validator::make($data, [
            'name'        => 'required|string|max:255',
            'reference'   => 'nullable|string|max:100|unique:products,reference',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'photo_url'   => 'nullable|url',
            'category_id' => 'required|integer|exists:categories,id'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        // Verificar existencia de categoría (extra por seguridad)
        if (!$this->categories->findById($data['category_id'])) {
            throw new \Exception('Categoría no encontrada');
        }

        return $this->products->create($data);
    }

    /**
     * Obtener producto por ID.
     */
    public function get(int $id)
    {
        return $this->products->findById($id);
    }

    /**
     * Actualizar producto con validaciones.
     */
    public function update(int $id, array $data)
    {
        // Validaciones dependiendo de los campos enviados
        $validator = Validator::make($data, [
            'name'        => 'sometimes|string|max:255',
            'reference'   => "sometimes|string|max:100|unique:products,reference,$id",
            'price'       => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string',
            'photo_url'   => 'sometimes|url',
            'category_id' => 'sometimes|integer|exists:categories,id'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        // Validar categoría si viene en request
        if (isset($data['category_id']) && !$this->categories->findById($data['category_id'])) {
            throw new \Exception('Categoría no encontrada');
        }

        return $this->products->update($id, $data);
    }

    /**
     * Eliminar producto.
     */
    public function delete(int $id): bool
    {
        return $this->products->delete($id);
    }

    /**
     * Listado general.
     */
    public function list(): array
    {
        return $this->products->all();
    }

    /**
     * Listar productos por categoría.
     */
    public function listByCategory(int $categoryId): array
    {
        return $this->products->findByCategoryId($categoryId);
    }
}
