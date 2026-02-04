<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\DistributionCenterHandler;

class DistributionCenterController extends Controller
{
    /**
     * Listar todos los centros de distribución.
     */
    public function list(DistributionCenterHandler $handler)
    {
        return response()->json([
            'data' => $handler->list()
        ]);
    }

    /**
     * Crear un nuevo centro de distribución.
     */
    public function create(Request $request, DistributionCenterHandler $handler)
    {
        try {
            $center = $handler->create($request->all());
            return response()->json([
                'message' => 'Centro de distribución creado correctamente',
                'data' => $center
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Mostrar un centro específico.
     */
    public function show(DistributionCenterHandler $handler, $id)
    {
        $center = $handler->get($id);
        if (!$center) {
            return response()->json(['message' => 'Centro no encontrado'], 404);
        }
        return response()->json(['data' => $center]);
    }

    /**
     * Actualizar un centro existente.
     */
    public function update(Request $request, DistributionCenterHandler $handler, $id)
    {
        try {
            $center = $handler->update($id, $request->all());
            if (!$center) {
                return response()->json(['message' => 'Centro no encontrado'], 404);
            }
            return response()->json([
                'message' => 'Centro actualizado correctamente',
                'data' => $center
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Eliminar un centro.
     */
    public function destroy(DistributionCenterHandler $handler, $id)
    {
        try {
            if (!$handler->delete($id)) {
                return response()->json(['message' => 'Centro de distribución no encontrado'], 404);
            }

            return response()->json(['message' => 'Centro de distribución eliminado correctamente']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Obtener métodos de envío disponibles según el código postal.
     */
    public function getShippingMethods(Request $request, DistributionCenterHandler $handler)
    {
        try {
            $postalCode = $request->query('postal_code');
            $methods = $handler->getMethodsByPostalCode($postalCode);

            return response()->json([
                'status' => 'success',
                'data'   => $methods
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
