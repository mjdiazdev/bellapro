<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogisticCenter extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'postal_code',
        'contact_email'
    ];

    public function zones()
    {
        return $this->hasMany(LogisticCenterZone::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
