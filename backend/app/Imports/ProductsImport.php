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
            // Saltamos filas que no tengan referencia (identificador principal)
            if (!isset($row['referencia']) || empty($row['referencia'])) continue;

            // Usamos transacciones para asegurar la integridad de los datos por cada fila
            DB::transaction(function () use ($row) {

                // 1. GESTIÓN DE CATEGORÍA
                // Buscamos por código. Si no existe, usamos el Handler para crearla con su QR.
                $category = Category::where('code', $row['categoria'])->first();

                if (!$category) {
                    $category = $this->categoryHandler->create([
                        'name' => $row['categoria'],
                        'code' => $row['categoria']
                    ]);
                }

                // 2. GESTIÓN DE PRODUCTO (UPSERT)
                // Buscamos si el producto ya existe mediante su referencia única
                $product = Product::where('reference', $row['referencia'])->first();

                $productData = [
                    'category_id' => $category->id,
                    'name'        => $row['nombre'],
                    'price'       => $row['precio'],
                    'description' => $row['descripcion'] ?? null,
                    // Nota: photo_url no se guarda aquí, se vincula por nombre de archivo (referencia)
                ];

                if ($product) {
                    // Si existe: Actualizamos datos básicos y SUMAMOS la cantidad al stock existente
                    $product->update($productData);

                    $currentStock = $product->stock ? $product->stock->stock : 0;
                    $product->stock()->update([
                        'stock' => $currentStock + (int)$row['cantidad']
                    ]);
                } else {
                    // Si no existe: Creamos el producto y asignamos el stock inicial
                    $productData['reference'] = $row['referencia'];
                    $newProduct = Product::create($productData);

                    $newProduct->stock()->create([
                        'stock' => (int)$row['cantidad'],
                        'min_stock' => 1 // Valor por defecto
                    ]);
                }
            });
        }
    }
}
