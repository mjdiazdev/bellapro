<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\OrderHandler;

/**
 * Controlador para órdenes de venta
 */
class OrderController extends Controller
{
    public function create(Request $request, OrderHandler $handler)
    {
        try {
            $order = $handler->create($request->all());

            return response()->json([
                'message' => 'Orden creada correctamente',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function capturePaypal(Request $request, OrderHandler $handler, $orderId)
    {
        try {
            $order = $handler->capturePaypalPayment(
                $orderId,
                $request->paypal_order_id
            );

            return response()->json([
                'message' => 'Pago confirmado correctamente',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Listar todas las órdenes
     */
    public function list(Request $request, OrderHandler $handler)
    {
        // Capturamos 'per_page' de la request, por defecto 25
        $perPage = $request->query('per_page', 25);

        return response()->json(
            $handler->list($perPage)
        );
    }

    /**
     * Ver detalle de una orden
     */
    public function show(OrderHandler $handler, int $id)
    {
        $order = $handler->get($id);

        if (!$order) {
            return response()->json([
                'message' => 'Orden no encontrada'
            ], 404);
        }

        return response()->json([
            'data' => $order
        ]);
    }

    /**
     * Actualizar el estado de múltiples órdenes
     */
    public function bulkStatusUpdate(Request $request, OrderHandler $handler)
    {
        try {
            $handler->changeStatusBulk($request->all());
            return response()->json(['message' => 'Pedidos actualizados correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

}
