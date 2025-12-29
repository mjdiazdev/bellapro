<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShippingMethod extends Model
{
    protected $fillable = ['name','description','price'];

    /**
     * Obtener los pedidos asociados al método de envío.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Obtener los centros de distribución asociados al método de envío.
     */
    public function distributionCenters()
    {
        return $this->belongsToMany(DistributionCenter::class, 'dist_center_shipping_method');
    }
}
