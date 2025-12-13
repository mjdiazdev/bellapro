<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    protected $fillable = [
        'nif', 'email', 'name', 'phone', 'address', 'address_extra', 'postal_code_id'
    ];

    public function postalCode(): BelongsTo
    {
        return $this->belongsTo(PostalCode::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
