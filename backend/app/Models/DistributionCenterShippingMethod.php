<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionCenterShippingMethod extends Model
{
    // Definimos explícitamente el nombre de la tabla
    protected $table = 'dist_center_shipping_method';

    protected $fillable = [
        'distribution_center_id',
        'shipping_method_id'
    ];

    /**
     * Relación con el Centro de Distribución
     */
    public function distributionCenter(): BelongsTo
    {
        return $this->belongsTo(DistributionCenter::class);
    }

    /**
     * Relación con el Método de Envío
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    public function orders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Order::class, 'dist_center_shipping_method_id');
    }
}
