<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShippingMethod extends Model
{
    protected $fillable = ['name','description','price'];
    protected $casts = [
        'status' => 'boolean',
    ];
    /**
     * Obtener los centros de distribución asociados al método de envío.
     */
    public function distributionCenters()
    {
        return $this->belongsToMany(DistributionCenter::class, 'dist_center_shipping_method');
    }
}
