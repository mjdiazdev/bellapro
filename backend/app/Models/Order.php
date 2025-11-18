<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'client_id',
        'billing_address_id',
        'shipping_address_id',
        'logistic_center_id',
        'subtotal',
        'vat',
        'total',
        'shipping_type',
        'status'
    ];

    public function client()
    {
        return $this->belongsTo(Customer::class);
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function logisticCenter()
    {
        return $this->belongsTo(LogisticCenter::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
