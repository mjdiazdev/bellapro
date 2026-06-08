<?php

namespace App\Services;

class RedsysService
{
    /**
     * HMAC_SHA256_V1: deriva la clave con 3DES-CBC usando el número de pedido.
     * Algoritmo oficial exigido por Redsys (guía de integración).
     */
    private function diversifyKey(string $base64Secret, string $order): string
    {
        $key = base64_decode($base64Secret);
        $iv  = "\0\0\0\0\0\0\0\0";

        $orderPadded = str_pad($order, (int) ceil(strlen($order) / 8) * 8, "\0");

        return openssl_encrypt(
            $orderPadded,
            'des-ede3-cbc',
            $key,
            OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING,
            $iv
        );
    }

    /**
     * Genera los parámetros necesarios para redirigir al TPV Redsys.
     *
     * @param  array  $data  ['order_number', 'amount_cents', 'url_ok', 'url_ko']
     */
    public function initiatePayment(array $data): array
    {
        $secret   = env('REDSYS_CLAVE_SECRETA');
        $fuc      = env('REDSYS_FUC');
        $terminal = env('REDSYS_TERMINAL', '3');
        $moneda   = env('REDSYS_MONEDA', '978');
        $url      = env('REDSYS_URL');

        $params = [
            'Ds_Merchant_Amount'          => (string) $data['amount_cents'],
            'Ds_Merchant_Order'           => (string) $data['order_number'],
            'Ds_Merchant_MerchantCode'    => (string) $fuc,
            'Ds_Merchant_Currency'        => $moneda,
            'Ds_Merchant_TransactionType' => '0',
            'Ds_Merchant_Terminal'        => (string) $terminal,
            'Ds_Merchant_MerchantURL'     => env('APP_URL') . '/api/redsys/notification',
            'Ds_Merchant_UrlOK'           => $data['url_ok'],
            'Ds_Merchant_UrlKO'           => $data['url_ko'],
        ];

        $merchantParameters = base64_encode(json_encode($params, JSON_UNESCAPED_UNICODE));
        $diversifiedKey     = $this->diversifyKey($secret, $data['order_number']);
        $signature          = base64_encode(hash_hmac('sha256', $merchantParameters, $diversifiedKey, true));

        return [
            'url'                => $url,
            'merchantParameters' => $merchantParameters,
            'signature'          => $signature,
            'signatureVersion'   => 'HMAC_SHA256_V1',
        ];
    }

    /**
     * Verifica la firma de la notificación Redsys y devuelve los datos decodificados.
     * Retorna null si la firma es inválida.
     */
    public function verifyNotification(string $merchantParameters, string $receivedSignature): ?array
    {
        $secret = env('REDSYS_CLAVE_SECRETA');

        $normalizedSignature = str_replace(['-', '_'], ['+', '/'], $receivedSignature);

        try {
            $decoded = base64_decode($merchantParameters, true);
            $data    = json_decode($decoded, true);

            if (!isset($data['Ds_Order'])) {
                return null;
            }

            $diversifiedKey     = $this->diversifyKey($secret, $data['Ds_Order']);
            $expectedSignature  = base64_encode(hash_hmac('sha256', $merchantParameters, $diversifiedKey, true));

            if ($expectedSignature !== $normalizedSignature) {
                return null;
            }

            return $data;

        } catch (\Throwable $e) {
            return null;
        }
    }
}
