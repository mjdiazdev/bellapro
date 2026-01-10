<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Handlers\ImportHandler;
use Illuminate\Http\Request;

/**
 * Controlador de API para gestionar la subida de archivos de datos.
 */
class ImportController extends Controller
{
    /**
     * Inyectamos el handler de importación.
     */
    public function __construct(private ImportHandler $handler) {}

    /**
     * Recibe el archivo desde el cliente (React/Insomnia) y lo valida.
     */
    public function upload(Request $request)
    {
        // Validación de tipo de archivo y tamaño máximo (5MB)
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        try {
            // Delegamos el procesamiento al Handler
            $result = $this->handler->bulkImport($request->file('file'));
            return response()->json($result, 200);
        } catch (\Exception $e) {
            // Respuesta de error clara para el frontend
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
