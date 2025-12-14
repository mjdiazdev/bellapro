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
}
