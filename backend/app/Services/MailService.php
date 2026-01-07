<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\PurchaseMail;

class MailService
{
    public function sendPurchaseMail(string $email, array $orderData): void
    {
        $payload = [
            'order_number'   => "0000000-{$orderData['order_number']}",
            'customer_name'  => $orderData['customer_name'],
            'customer_id'    => $orderData['customer_id'],
            'purchase_date'  => $orderData['purchase_date'],
            // Items (formato que el Blade espera)
            'items' => array_map(function ($item) {
                return [
                    'name' => $item['product_name'],
                    'qty' => $item['quantity'],
                    'price' => $item['unit_price'],
                ];
            }, $orderData['items']),
            'subtotal'       => $orderData['subtotal_products'],
            'shipping'       => [
                'method_name' => $orderData['shipping']['method_name'],
                'price'       => $orderData['shipping']['price'],
            ],
            'iva_amount'     => $orderData['iva_amount'],
            'total_with_iva' => $orderData['total_with_iva'],
        ];

        Mail::to($email)->send(new PurchaseMail($payload));
    }
}
