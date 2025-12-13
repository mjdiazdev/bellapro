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
}
