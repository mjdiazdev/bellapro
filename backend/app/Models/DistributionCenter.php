<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionCenter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'postal_code_id'
    ];

    /**
     * Obtener el código postal asociado al centro de distribución.
     */
    public function postalCode(): BelongsTo
    {
        return $this->belongsTo(PostalCode::class);
    }

    /**
     * Obtener los métodos de envío asociados al centro de distribución.
     */
    public function shippingMethods()
    {
        return $this->belongsToMany(ShippingMethod::class, 'dist_center_shipping_method');
    }
}
