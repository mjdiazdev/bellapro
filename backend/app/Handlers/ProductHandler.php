<?php
namespace App\Handlers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
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
        $validator = Validator::make($data, [
            'name'        => 'required|string|max:255',
            'reference'   => 'nullable|string|max:100|unique:products,reference',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'stock'       => 'nullable|integer|min:0',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return DB::transaction(function () use ($data) {
            // Manejo del archivo
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                // Esto guardará el archivo en: storage/app/public/products
                $path = $data['image']->store('products', 'public');

                // Guardamos esa ruta en el campo 'photo_url' o 'image' de tu DB
                $data['photo_url'] = $path;
            }

            // Crear el producto con la ruta del archivo ya seteada
            $product = $this->products->create($data);

            // Crear stock inicial
            $product->stock()->create([
                'stock' => $data['stock'] ?? 0,
                'min_stock' => $data['min_stock'] ?? 1,
            ]);

            return $product->load('stock');
        });
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
        // 1. Validaciones
        $validator = Validator::make($data, [
            'name'        => 'sometimes|string|max:255',
            'reference'   => "sometimes|string|max:100|unique:products,reference,$id",
            'price'       => 'sometimes|numeric|min:0',
            'description' => 'sometimes|string|nullable',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'stock'       => 'sometimes|integer|min:0',
            'min_stock'   => 'sometimes|integer|min:0',
            'image'       => 'sometimes|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        // 2. Proceso de actualización mediante Transacción
        return DB::transaction(function () use ($id, $data) {
            // Buscamos el producto actual para tener acceso a la ruta de la imagen anterior
            $product = $this->products->findById($id);

            if (!$product) {
                throw new \Exception('Producto no encontrado');
            }

            // 3. Manejo de la Nueva Imagen
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                // Eliminar la imagen anterior del disco 'public' si existe
                if ($product->photo_url) {
                    Storage::disk('public')->delete($product->photo_url);
                }

                // Guardar la nueva imagen
                $path = $data['image']->store('products', 'public');

                // Actualizamos el campo con la nueva ruta relativa
                $data['photo_url'] = $path;
            }

            // 4. Actualizar datos básicos del producto
            $product = $this->products->update($id, $data);

            // 5. Actualizar el Stock
            if (isset($data['stock']) || isset($data['min_stock'])) {
                $product->stock()->updateOrCreate(
                    ['product_id' => $product->id],
                    array_filter([
                        'stock'     => $data['stock'] ?? null,
                        'min_stock' => $data['min_stock'] ?? null,
                    ], fn($value) => !is_null($value))
                );
            }

            return $product->load(['category', 'stock']);
        });
    }

    /**
     * Actualización masiva de productos (Precio y Stock).
     * * @param array $items
     * @return int Cantidad de productos procesados
     * @throws \Exception
     */
    public function bulkUpdate(array $items)
    {
        if (empty($items)) {
            throw new \Exception("No hay datos para actualizar.");
        }

        // 1. Validar la estructura general del array
        $validator = Validator::make(['items' => $items], [
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        // 2. Ejecutar la operación atómica
        return DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                // Actualizamos el precio en la tabla products
                $this->products->update($item['id'], [
                    'price' => $item['price']
                ]);

                // Actualizamos la cantidad en la tabla product_stocks
                // Buscamos el producto para acceder a su relación
                $product = $this->products->findById($item['id']);
                if ($product) {
                    $product->stock()->update([
                        'stock' => $item['stock']
                    ]);
                }
            }

            return count($items);
        });
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
