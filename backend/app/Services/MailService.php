<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

class MailService
{
    public function sendPurchaseMail(string $email, array $orderData): void
    {
        $payload = [
            'order_number'   => "0000000-{$orderData['order_number']}",
            'customer_name'  => $orderData['customer_name'],
            'customer_id'    => $orderData['customer_id'],
            'purchase_date'  => $orderData['purchase_date'],
            'items' => array_map(function ($item) {
                return [
                    'name'  => $item['product_name'],
                    'qty'   => $item['quantity'],
                    'price' => $item['unit_price'],
                ];
            }, $orderData['items']),
            'subtotal'       => $orderData['subtotal_products'],
            'shipping'       => [
                'method_name' => $orderData['shipping']['method_name'],
                'price'       => $orderData['shipping']['price'],
            ],
            'discount_amount' => $orderData['discount_amount'] ?? null,
            'iva_amount'      => $orderData['iva_amount'],
            'total_with_iva'  => $orderData['total_with_iva'],
        ];

        $adminOrdersEmail = config('mail.admin_orders_email');

        Mail::send('emails.purchase', ['data' => $payload], function ($message) use ($email, $adminOrdersEmail) {
            $message->to($email)
                    ->subject('Confirmación de compra - BellaPro');

            // Copia interna para el equipo comercial, si esta configurada en el .env
            if (!empty($adminOrdersEmail)) {
                $message->cc($adminOrdersEmail);
            }
        });
    }
}
