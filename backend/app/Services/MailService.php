<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\View;

class MailService
{
    private string $apiKey;
    private string $apiUrl = 'https://api.brevo.com/v3/smtp/email';

    public function __construct()
    {
      $this->apiKey = config('services.brevo.api_key');

    }

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
            'iva_amount'     => $orderData['iva_amount'],
            'total_with_iva' => $orderData['total_with_iva'],
        ];

        // Renderizar la vista Blade a HTML
        $htmlContent = View::make('emails.purchase', ['data' => $payload])->render();

        // Enviar via API HTTP de Brevo (puerto 443, no SMTP)
        $response = Http::withHeaders([
            'api-key'      => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->apiUrl, [
            'sender' => [
                'name'  => 'BellaPro',
                'email' => env('MAIL_FROM_ADDRESS', 'mjdiaz.dev@gmail.com'),
            ],
            'to' => [
                ['email' => $email]
            ],
            'subject'      => 'Confirmación de compra - BellaPro',
            'htmlContent'  => $htmlContent,
        ]);

        if (!$response->successful()) {
            throw new \Exception('Error enviando correo via Brevo API: ' . $response->body());
        }
    }
}
