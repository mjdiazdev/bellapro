<?php
namespace App\Handlers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;
use Illuminate\Support\Str;

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
            // 1. Manejo del archivo
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                $extension = $data['image']->getClientOriginalExtension();
                // Generamos el nombre basado en el producto (Slug)
                $fileName = Str::upper(Str::slug($data['name'], '-')) . '.' . $extension;

                $data['image']->storeAs('products', $fileName, 'public');

                // IMPORTANTE: Guardamos el nombre final en el array data
                $data['image'] = $fileName;
            }

            // Crear el producto
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
            if (!$product) throw new \Exception('Producto no encontrado');

            $oldReference = $product->reference;
            $newReference = $data['reference'] ?? $oldReference;

            // --- CASO 1: Si la referencia cambió, renombrar archivos existentes ---
            if ($newReference !== $oldReference) {
                $extensions = ['jpg', 'jpeg', 'png', 'webp'];
                foreach ($extensions as $ext) {
                    $oldPath = "products/{$oldReference}.{$ext}";
                    if (Storage::disk('public')->exists($oldPath)) {
                        $newPath = "products/{$newReference}.{$ext}";
                        Storage::disk('public')->move($oldPath, $newPath);
                    }
                }
            }

            // --- CASO 2: Si se sube una imagen nueva ---
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                // Borrar cualquier imagen previa con la referencia (nueva o vieja) para evitar duplicidad de extensiones
                $extensions = ['jpg', 'jpeg', 'png', 'webp'];
                foreach ($extensions as $ext) {
                    Storage::disk('public')->delete("products/{$newReference}.{$ext}");
                }

                // Guardar la nueva con el nombre de la referencia actual
                $extension = $data['image']->getClientOriginalExtension();
                $fileName = $newReference . '.' . $extension;
                $data['image']->storeAs('products', $fileName, 'public');
            }

            // --- CASO 3: Actualizar datos en BD ---
            // Eliminamos 'image' del array data para que no intente guardarlo en la BD
            unset($data['image']);
            $product = $this->products->update($id, $data);

            // --- CASO 4: Actualizar Stock ---
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

        $validator = Validator::make(['items' => $items], [
            'items'          => 'required|array',
            'items.*.id'     => 'required|integer|exists:products,id',
            'items.*.price'  => 'required|numeric|min:0',
            'items.*.stock'  => 'required|integer|min:0',
            'items.*.status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        return DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                // 1. Actualizamos precio; status solo si viene en el payload
                $updateData = ['price' => $item['price']];
                if (array_key_exists('status', $item)) {
                    $updateData['status'] = $item['status'];
                }
                $this->products->update($item['id'], $updateData);

                // 2. Actualizamos el stock
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
        // 1. Buscamos el producto primero para poder inspeccionarlo
        $product = $this->products->findById($id);

        if (!$product) {
            return false;
        }

        // 2. Validar si tiene pedidos
        if ($product->orderItems()->exists()) {
            throw new \Exception("No se puede eliminar el producto '{$product->name}' porque ya tiene ventas registradas.");
        }

        // 3. Si pasa la validación, procedemos a borrar
        return $this->products->delete($id);
    }

    /**
     * Listado general con paginación dinámica.
     */
    public function list(int $perPage = 25)
    {
        return $this->products->all($perPage);
    }

    /**
     * Listar productos por categoría.
     */
    public function listByCategory(int $categoryId): array
    {
        return $this->products->findByCategoryId($categoryId);
    }
}
