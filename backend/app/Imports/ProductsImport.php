<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use App\Handlers\CategoryHandler;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Clase encargada de mapear los datos del Excel/CSV a la base de datos.
 * Implementa ToCollection para procesar bloques de datos y WithHeadingRow para usar los nombres de las columnas.
 */
class ProductsImport implements ToCollection, WithHeadingRow
{
    private $categoryHandler;

    /**
     * Se inyecta CategoryHandler para asegurar que las categorías nuevas
     * sigan la lógica de generación de códigos QR.
     */
    public function __construct(CategoryHandler $categoryHandler)
    {
        $this->categoryHandler = $categoryHandler;
    }

    /**
     * Procesa la colección de filas del archivo.
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row)
        {
            if (!isset($row['referencia']) || empty($row['referencia'])) continue;

            DB::transaction(function () use ($row) {
                // 1. GESTIÓN DE CATEGORÍA (Con cast a string para evitar errores)
                $catCode = (string) $row['categoria'];
                $category = Category::where('code', $catCode)->first();

                if (!$category) {
                    $category = $this->categoryHandler->create([
                        'name' => "Categoría " . $catCode,
                        'code' => $catCode
                    ]);
                }

                // 2. PREPARACIÓN DE DATOS
                $nombreImagen = !empty($row['imagenes']) ? trim((string)$row['imagenes']) . '.jpg' : null;

                $productData = [
                    'category_id' => $category->id,
                    'name'        => (string) ($row['descripcion'] ?? $row['nombre'] ?? 'Sin nombre'),
                    'price'       => floatval(str_replace(',', '.', $row['precio'])),
                    'image'       => $nombreImagen,
                ];

                // 3. UPSERT DE PRODUCTO
                $product = Product::where('reference', $row['referencia'])->first();

                if ($product) {
                    // ACTUALIZACIÓN
                    $product->update($productData);

                    // IMPORTANTE: Usamos updateOrCreate para asegurar que el registro de stock existe
                    $cantidadNueva = (int)($row['cantidad'] ?? 0);

                    // Si quieres que SUME siempre:
                    $stockActual = $product->stock ? $product->stock->stock : 0;
                    $product->stock()->updateOrCreate(
                        ['product_id' => $product->id],
                        ['stock' => $stockActual + $cantidadNueva]
                    );
                } else {
                    // CREACIÓN
                    $productData['reference'] = $row['referencia'];
                    $newProduct = Product::create($productData);

                    $newProduct->stock()->create([
                        'stock' => (int)($row['cantidad'] ?? 0),
                        'min_stock' => 1
                    ]);
                }
            });
        }
    }
}
