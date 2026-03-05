<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DistributionCenter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'user_id'
    ];

    public function coordinator() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(DistributionCenterLocation::class);
    }

    public function shippingMethods()
    {
        return $this->belongsToMany(ShippingMethod::class, 'dist_center_shipping_method')
                    ->withPivot('id')
                    ->withTimestamps();
    }
}
