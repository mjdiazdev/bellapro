<?php

namespace App\Handlers;

use App\Models\Coupon;
use App\Repositories\CouponRepository;
use Illuminate\Database\Eloquent\Collection;

class CouponHandler
{
    public function __construct(private CouponRepository $coupons) {}

    public function list(): Collection
    {
        return $this->coupons->all();
    }

    public function create(array $data): Coupon
    {
        return $this->coupons->create($data);
    }

    public function update(int $id, array $data): Coupon
    {
        $coupon = $this->coupons->find($id);
        if (!$coupon) throw new \Exception('Cupón no encontrado.');
        return $this->coupons->update($coupon, $data);
    }

    public function toggle(int $id): Coupon
    {
        $coupon = $this->coupons->find($id);
        if (!$coupon) throw new \Exception('Cupón no encontrado.');
        return $this->coupons->update($coupon, ['active' => !$coupon->active]);
    }

    public function delete(int $id): void
    {
        $coupon = $this->coupons->find($id);
        if (!$coupon) throw new \Exception('Cupón no encontrado.');
        $this->coupons->delete($coupon);
    }

    /**
     * Valida el cupón contra las reglas básicas (sin calcular descuento).
     * Lanza excepción si no es válido.
     */
    public function validateCoupon(string $code, float $productSubtotal): Coupon
    {
        $coupon = $this->coupons->findByCode($code);

        if (!$coupon) {
            throw new \Exception('El cupón introducido no existe.');
        }
        if (!$coupon->active) {
            throw new \Exception('Este cupón no está activo.');
        }
        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            throw new \Exception('Este cupón ha expirado.');
        }
        if ($coupon->max_uses !== null && $coupon->uses_count >= $coupon->max_uses) {
            throw new \Exception('Este cupón ha alcanzado el límite de usos.');
        }
        if ($coupon->min_order_amount !== null && $productSubtotal < $coupon->min_order_amount) {
            throw new \Exception(
                'El subtotal mínimo para usar este cupón es €' . number_format($coupon->min_order_amount, 2) . '.'
            );
        }

        return $coupon;
    }

    /**
     * Calcula el importe del descuento dado un cupón y los artículos del carrito.
     * $cartItems = [['product_id' => x, 'quantity' => y, 'unit_price' => z], ...]
     */
    public function calculateDiscount(Coupon $coupon, array $cartItems, float $productSubtotal): float
    {
        if ($coupon->scope === 'products' && !empty($coupon->product_ids)) {
            $applicableBase = 0;
            foreach ($cartItems as $item) {
                if (in_array($item['product_id'], $coupon->product_ids)) {
                    $applicableBase += $item['unit_price'] * $item['quantity'];
                }
            }
            if ($applicableBase <= 0) {
                throw new \Exception('Este cupón no aplica a ningún producto de tu carrito.');
            }
        } else {
            $applicableBase = $productSubtotal;
        }

        if ($coupon->type === 'percentage') {
            return round($applicableBase * ($coupon->value / 100), 2);
        }

        return min((float) $coupon->value, $applicableBase);
    }

    public function incrementUsage(Coupon $coupon): void
    {
        $this->coupons->incrementUsage($coupon);
    }
}
