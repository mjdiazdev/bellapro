<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PostalCode extends Model
{
    protected $fillable = ['code','city_id'];

    /**
     * Obtener la ciudad asociada a este código postal.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Obtener los clientes asociados a este código postal.
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Obtener las órdenes asociadas a este código postal.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'delivery_postal_code_id');
    }

    /**
     * Obtener los centros de distribución en este código postal.
     */
    public function distributionCenters()
    {
        return $this->hasMany(DistributionCenter::class);
    }
}
