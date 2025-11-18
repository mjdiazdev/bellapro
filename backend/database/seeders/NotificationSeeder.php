<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Customer;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        $order = Order::first();
        $customer = Customer::first();

        Notification::create([
            'type' => 'admin',
            'message' => 'Nuevo pedido recibido.',
            'order_id' => $order->id,
            'customer_id' => $customer->id,
            'sent' => true
        ]);

        Notification::create([
            'type' => 'customer',
            'message' => 'Tu pedido ha sido confirmado.',
            'order_id' => $order->id,
            'customer_id' => $customer->id,
            'sent' => true
        ]);
    }
}
