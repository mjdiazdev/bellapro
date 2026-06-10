<?php

namespace App\Repositories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Collection;

class CouponRepository
{
    public function all(): Collection
    {
        return Coupon::orderByDesc('id')->get();
    }

    public function findByCode(string $code): ?Coupon
    {
        return Coupon::where('code', strtoupper($code))->first();
    }

    public function find(int $id): ?Coupon
    {
        return Coupon::find($id);
    }

    public function create(array $data): Coupon
    {
        $data['code'] = strtoupper($data['code']);
        return Coupon::create($data);
    }

    public function update(Coupon $coupon, array $data): Coupon
    {
        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }
        $coupon->update($data);
        return $coupon->fresh();
    }

    public function incrementUsage(Coupon $coupon): void
    {
        $coupon->increment('uses_count');
    }

    public function delete(Coupon $coupon): void
    {
        $coupon->delete();
    }
}
