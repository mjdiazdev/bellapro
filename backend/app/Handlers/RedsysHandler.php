<?php

namespace App\Handlers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\RedsysService;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RedsysHandler
{
    public function __construct(
        private RedsysService $redsys,
        private MailService   $mail,
        private OrderHandler  $orders
    ) {}

    /**
     * Genera los parámetros Redsys para redirigir al TPV.
     * El importe se convierte a céntimos (Redsys exige entero sin decimales).
     * El número de pedido debe ser 4-12 caracteres alfanuméricos.
     */
    public function initiatePayment(Order $order): array
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $orderNumber = sprintf('%012d', $order->id); // 12 dígitos con zeros

        return $this->redsys->initiatePayment([
            'order_number' => $orderNumber,
            'amount_cents' => (int) round($order->total * 100),
            'url_ok'       => $frontendUrl . '/pago/redsys-ok',
            'url_ko'       => $frontendUrl . '/pago/redsys-error',
        ]);
    }

    /**
     * Procesa la notificación POST de Redsys (webhook).
     * Redsys espera respuesta "OK" en texto plano.
     */
    public function processNotification(Request $request): string
    {
        $merchantParameters  = $request->input('Ds_MerchantParameters');
        $receivedSignature   = $request->input('Ds_Signature');

        if (!$merchantParameters || !$receivedSignature) {
            Log::error('Redsys notification: missing parameters');
            return 'OK';
        }

        $data = $this->redsys->verifyNotification($merchantParameters, $receivedSignature);

        if (!$data) {
            Log::error('Redsys notification: invalid signature');
            return 'OK';
        }

        $redsysOrderNumber = $data['Ds_Order'] ?? null;
        $responseCode      = $data['Ds_Response'] ?? null;

        if (!$redsysOrderNumber || $responseCode === null) {
            Log::error('Redsys notification: missing Ds_Order or Ds_Response');
            return 'OK';
        }

        // Recuperamos el ID real de la orden (invertimos el sprintf %012d)
        $orderId = (int) ltrim($redsysOrderNumber, '0') ?: 0;
        $order   = Order::find($orderId);

        if (!$order) {
            Log::error("Redsys notification: order {$orderId} not found");
            return 'OK';
        }

        $payment = Payment::where('order_id', $orderId)->first();

        if ((string) $responseCode >= '0000' && (string) $responseCode <= '0099') {
            $order->update(['status' => 'completed']);

            if ($payment) {
                $payment->update([
                    'status'  => 'completed',
                    'details' => $data,
                ]);
            }

            Log::info("Redsys PAGO OK — Order: {$orderId}, Código: {$responseCode}");

            try {
                $mailData = $this->orders->prepareOrderMailDataPublic($order);
                $this->mail->sendPurchaseMail($order->delivery_email, $mailData);
            } catch (\Throwable $mailError) {
                Log::error("Redsys: error enviando email orden {$orderId}: " . $mailError->getMessage());
            }

        } else {
            $order->update(['status' => 'canceled']);

            if ($payment) {
                $payment->update([
                    'status'  => 'failed',
                    'details' => $data,
                ]);
            }

            Log::warning("Redsys PAGO DENEGADO — Order: {$orderId}, Código: {$responseCode}");
        }

        return 'OK';
    }
}
