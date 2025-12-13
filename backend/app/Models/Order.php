<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'customer_id', 'delivery_email', 'delivery_name', 'delivery_nif',
        'delivery_address', 'delivery_address_extra', 'delivery_phone',
        'delivery_postal_code_id', 'shipping_method_id',
        'subtotal', 'shipping_price', 'total', 'status'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function postalCode(): BelongsTo
    {
        return $this->belongsTo(PostalCode::class, 'delivery_postal_code_id');
    }

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
