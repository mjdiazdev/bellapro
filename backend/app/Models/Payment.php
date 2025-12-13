<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id', 'method', 'details', 'amount', 'status'];
    protected $casts = ['details' => 'array'];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
