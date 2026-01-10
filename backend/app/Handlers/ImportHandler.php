<?php

namespace App\Handlers;

use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductsImport;
use App\Handlers\CategoryHandler;
use Illuminate\Http\UploadedFile;

/**
 * Handler especializado en la lógica de importación de archivos.
 * Mantiene el controlador limpio de lógica de procesamiento de archivos.
 */
class ImportHandler
{
    /**
     * Inyectamos CategoryHandler para pasarlo posteriormente al ProductsImport.
     */
    public function __construct(private CategoryHandler $categoryHandler) {}

    /**
     * Ejecuta el proceso de importación masiva.
     * El archivo se procesa en memoria sin necesidad de guardarlo permanentemente en el servidor.
     */
    public function bulkImport(UploadedFile $file)
    {
        try {
            // Iniciamos la importación pasando el archivo temporal y la instancia del handler de categorías
            Excel::import(new ProductsImport($this->categoryHandler), $file);

            return [
                'success' => true,
                'message' => 'Carga masiva procesada exitosamente.'
            ];
        } catch (\Exception $e) {
            // Capturamos cualquier error de formato o de base de datos
            throw new \Exception("Error procesando el archivo: " . $e->getMessage());
        }
    }
}
