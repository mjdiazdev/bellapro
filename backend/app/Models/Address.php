<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'client_id',
        'type',
        'address',
        'city',
        'postal_code',
        'country'
    ];

    public function client()
    {
        return $this->belongsTo(Customer::class);
    }
}
