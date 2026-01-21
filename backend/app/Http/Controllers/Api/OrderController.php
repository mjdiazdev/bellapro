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
    public function list(OrderHandler $handler)
    {
        return response()->json([
            'data' => $handler->list()
        ]);
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

}
