<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\CityHandler;

/**
 * Controlador para manejar Ciudades
 */
class CityController extends Controller
{
    /**
     * Listar todas las ciudades
     */
    public function list(CityHandler $handler)
    {
        return response()->json(['data' => $handler->list()]);
    }

    /**
     * Obtener ciudad por código postal
     */
    public function getByPostalCode(CityHandler $handler, $postalCode)
    {
        $city = $handler->getByPostalCode($postalCode);

        if (!$city) {
            return response()->json(['message' => 'Ciudad no encontrada'], 404);
        }

        return response()->json(['data' => $city]);
    }
}
