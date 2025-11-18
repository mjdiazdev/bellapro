<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Address;
use App\Models\LogisticCenter;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $customer = Customer::first();
        $billing = Address::where('type', 'billing')->first();
        $shipping = Address::where('type', 'shipping')->first();
        $center = LogisticCenter::first();

        $order = Order::create([
            'customer_id' => $customer->id,
            'billing_address_id' => $billing->id,
            'shipping_address_id' => $shipping->id,
            'logistic_center_id' => $center->id,
            'subtotal' => 20.55,
            'vat' => 4.32,
            'total' => 24.87,
            'shipping_type' => 'standard',
            'status' => 'completed'
        ]);

        $product = Product::first();

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => $product->price_without_tax,
            'total_price' => $product->price_without_tax * 2
        ]);
    }
}
