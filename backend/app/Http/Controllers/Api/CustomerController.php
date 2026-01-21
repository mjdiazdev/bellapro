<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\CustomerHandler;

/**
 * Controlador para la API de clientes
 */
class CustomerController extends Controller
{
    public function create(Request $request, CustomerHandler $handler)
    {
        try {
            $customer = $handler->create($request->all());
            return response()->json([
                'message' => 'Cliente creado correctamente',
                'data' => $customer
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function list(CustomerHandler $handler)
    {
        return response()->json(['data' => $handler->list()]);
    }

    public function show(CustomerHandler $handler, $email)
    {
        $customer = $handler->getByEmail($email);
        if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 404);

        return response()->json(['data' => $customer]);
    }

    public function update(Request $request, CustomerHandler $handler, $email)
    {
        try {
            $customer = $handler->updateByEmail($email, $request->all());
            if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 404);

            return response()->json([
                'message' => 'Cliente actualizado correctamente',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(CustomerHandler $handler, $nif)
    {
        if (!$handler->deleteByNif($nif)) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        return response()->json(['message' => 'Cliente eliminado correctamente']);
    }

    public function destroyById(CustomerHandler $handler, $id)
    {
        if (!$handler->deleteById($id)) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        return response()->json(['message' => 'Cliente eliminado correctamente']);
    }

    public function updateById(Request $request, CustomerHandler $handler, $id)
    {
        try {
            $customer = $handler->updateById($id, $request->all());
            if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 404);

            return response()->json([
                'message' => 'Cliente actualizado correctamente',
                'data' => $customer
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function showById(CustomerHandler $handler, $id)
    {
        $customer = $handler->findById($id);
        if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 404);

        return response()->json(['data' => $customer]);
    }
}
