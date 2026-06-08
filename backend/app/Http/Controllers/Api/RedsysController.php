<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Handlers\RedsysHandler;
use Illuminate\Http\Request;

class RedsysController extends Controller
{
    /**
     * Webhook de notificación de Redsys.
     * Ruta pública sin CSRF (las rutas API son stateless en Laravel).
     * Redsys exige respuesta en texto plano "OK".
     */
    public function notification(Request $request, RedsysHandler $handler)
    {
        $result = $handler->processNotification($request);
        return response($result, 200)->header('Content-Type', 'text/plain');
    }
}
