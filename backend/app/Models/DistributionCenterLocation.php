<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionCenterLocation extends Model
{
    protected $fillable = ['distribution_center_id', 'postal_code_id', 'address'];

    public function postalCode(): BelongsTo
    {
        return $this->belongsTo(PostalCode::class);
    }

    /**
     * Relación inversa hacia el Centro de Distribución
     */
    public function distributionCenter(): BelongsTo
    {
        return $this->belongsTo(DistributionCenter::class);
    }
}
