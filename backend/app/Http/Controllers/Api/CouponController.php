<?php

namespace App\Http\Controllers\Api;

use App\Handlers\CouponHandler;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CouponController extends Controller
{
    public function __construct(private CouponHandler $handler) {}

    /** Listado admin */
    public function index(): JsonResponse
    {
        return response()->json(['coupons' => $this->handler->list()]);
    }

    /** Validar cupón — público, llamado desde el checkout */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code'                  => 'required|string',
            'items'                 => 'required|array|min:1',
            'items.*.product_id'    => 'required|integer',
            'items.*.quantity'      => 'required|integer|min:1',
        ]);

        try {
            $productIds = collect($request->items)->pluck('product_id');
            $products   = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $subtotal  = 0;
            $cartItems = [];
            foreach ($request->items as $item) {
                $product = $products->get($item['product_id']);
                if (!$product) continue;
                $unitPrice  = (float) $product->price;
                $subtotal  += $unitPrice * $item['quantity'];
                $cartItems[] = [
                    'product_id' => (int) $item['product_id'],
                    'quantity'   => (int) $item['quantity'],
                    'unit_price' => $unitPrice,
                ];
            }

            $coupon         = $this->handler->validateCoupon($request->code, $subtotal);
            $discountAmount = $this->handler->calculateDiscount($coupon, $cartItems, $subtotal);

            $label = $coupon->type === 'percentage'
                ? "{$coupon->value}% de descuento aplicado"
                : '€' . number_format($coupon->value, 2) . ' de descuento aplicado';

            return response()->json([
                'valid'           => true,
                'code'            => $coupon->code,
                'discount_amount' => $discountAmount,
                'message'         => $label,
            ]);

        } catch (\Exception $e) {
            return response()->json(['valid' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /** Crear cupón */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'code'              => 'required|string|max:50|unique:coupons,code',
            'type'              => 'required|in:percentage,fixed',
            'value'             => 'required|numeric|min:0.01',
            'scope'             => 'required|in:all,products',
            'product_ids'       => 'nullable|array',
            'product_ids.*'     => 'integer',
            'min_order_amount'  => 'nullable|numeric|min:0',
            'max_uses'          => 'nullable|integer|min:1',
            'active'            => 'boolean',
            'expires_at'        => 'nullable|date',
        ]);

        try {
            $coupon = $this->handler->create($request->all());
            return response()->json(['message' => 'Cupón creado', 'coupon' => $coupon], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Editar cupón */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'code'              => "sometimes|string|max:50|unique:coupons,code,{$id}",
            'type'              => 'sometimes|in:percentage,fixed',
            'value'             => 'sometimes|numeric|min:0.01',
            'scope'             => 'sometimes|in:all,products',
            'product_ids'       => 'nullable|array',
            'product_ids.*'     => 'integer',
            'min_order_amount'  => 'nullable|numeric|min:0',
            'max_uses'          => 'nullable|integer|min:1',
            'active'            => 'boolean',
            'expires_at'        => 'nullable|date',
        ]);

        try {
            $coupon = $this->handler->update($id, $request->all());
            return response()->json(['message' => 'Cupón actualizado', 'coupon' => $coupon]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Activar / desactivar */
    public function toggle(int $id): JsonResponse
    {
        try {
            $coupon = $this->handler->toggle($id);
            return response()->json(['message' => 'Estado actualizado', 'coupon' => $coupon]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** Eliminar */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->handler->delete($id);
            return response()->json(['message' => 'Cupón eliminado']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
