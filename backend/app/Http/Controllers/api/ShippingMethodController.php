<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\ShippingMethodHandler;

class ShippingMethodController extends Controller
{
    /**
     * Crear un método de envío.
     */
    public function create(Request $request, ShippingMethodHandler $handler)
    {
        // Validación de entrada
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0'
        ]);

        // Crear método
        $method = $handler->create($data);

        return response()->json([
            'message' => 'Método de envío creado correctamente',
            'data'    => $method
        ], 201);
    }

    /**
     * Mostrar un método de envío por ID.
     */
    public function show(ShippingMethodHandler $handler, $id)
    {
        $method = $handler->get($id);

        if (!$method) {
            return response()->json(['message' => 'Método de envío no encontrado'], 404);
        }

        return response()->json(['data' => $method]);
    }

    /**
     * Actualizar método de envío.
     */
    public function update(Request $request, ShippingMethodHandler $handler, $id)
    {
        // Validación de entrada
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'       => 'sometimes|numeric|min:0'
        ]);

        // Actualizar
        $method = $handler->update($id, $data);

        if (!$method) {
            return response()->json(['message' => 'Método de envío no encontrado'], 404);
        }

        return response()->json([
            'message' => 'Método de envío actualizado correctamente',
            'data'    => $method
        ]);
    }

    /**
     * Eliminar método de envío.
     */
    public function destroy(ShippingMethodHandler $handler, $id)
    {
        if (!$handler->delete($id)) {
            return response()->json(['message' => 'Método de envío no encontrado'], 404);
        }

        return response()->json(['message' => 'Método de envío eliminado correctamente']);
    }

    /**
     * Listar todos los métodos de envío.
     */
    public function list(ShippingMethodHandler $handler)
    {
        return response()->json([
            'data' => $handler->list()
        ]);
    }
}
