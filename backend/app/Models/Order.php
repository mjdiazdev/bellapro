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
        'delivery_postal_code_id',
        'dist_center_shipping_method_id',
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

    /**
     * Relación con la tabla intermedia para saber Centro y Método
     */
    public function distributionCenterMethod(): BelongsTo
    {
        // Definimos la relación manual indicando la tabla y los campos
        return $this->belongsTo(DistributionCenterShippingMethod::class, 'dist_center_shipping_method_id');
    }

    /**
     * Accesor opcional para obtener el nombre del método de envío directamente
     */
    public function getShippingMethodNameAttribute()
    {
        return $this->distributionCenterMethod->shippingMethod->name ?? 'N/A';
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
