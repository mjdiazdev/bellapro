<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\PostalCodeHandler;

/**
 * Controlador para manejar códigos postales
 */
class PostalCodeController extends Controller
{
    /**
     * Listar todos los códigos postales
     */
    public function list(PostalCodeHandler $handler)
    {
        return response()->json(['data' => $handler->list()]);
    }

    /**
     * Obtener códigos postales por ciudad
     */
    public function getByCity(PostalCodeHandler $handler, $cityId)
    {
        $postalCodes = $handler->getByCity($cityId);

        if (!$postalCodes) {
            return response()->json(['message' => 'Códigos postales no encontrados'], 404);
        }

        return response()->json(['data' => $postalCodes]);
    }

    /**
     * Buscar datos de localización por el código postal string (Ej: 08001)
     */
    public function search(PostalCodeHandler $handler, $code)
    {
        $postalCode = $handler->searchByCode($code);

        if (!$postalCode) {
            return response()->json(['message' => 'Código postal no encontrado'], 404);
        }

        return response()->json(['data' => $postalCode]);
    }

    /**
     * Busca en DB local; si no existe, consulta api.zippopotam.us y crea el registro.
     * Devuelve el mismo formato que search().
     */
    public function lookup(PostalCodeHandler $handler, $code)
    {
        $postalCode = $handler->lookupOrCreate($code);

        if (!$postalCode) {
            return response()->json(['message' => 'Código postal no encontrado'], 404);
        }

        return response()->json(['data' => $postalCode]);
    }
}
