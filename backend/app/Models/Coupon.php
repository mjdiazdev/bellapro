<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'scope', 'product_ids',
        'min_order_amount', 'max_uses', 'uses_count', 'active', 'expires_at',
    ];

    protected $casts = [
        'product_ids'      => 'array',
        'active'           => 'boolean',
        'expires_at'       => 'datetime',
        'value'            => 'float',
        'min_order_amount' => 'float',
    ];
}
