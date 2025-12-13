<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\ProvinceHandler;

/**
 * Controlador para manejar Provincias
 */
class ProvinceController extends Controller
{
    /**
     * Listar todas las provincias
     */
    public function list(ProvinceHandler $handler)
    {
        return response()->json(['data' => $handler->list()]);
    }

    /**
     * Obtener provincia de una ciudad por city_id
     */
    public function getByCity(ProvinceHandler $handler, $cityId)
    {
        $province = $handler->getByCity($cityId);

        if (!$province) {
            return response()->json(['message' => 'Provincia no encontrada'], 404);
        }

        return response()->json(['data' => $province]);
    }
}
