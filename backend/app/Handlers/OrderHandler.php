<?php

namespace App\Handlers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Services\PayPalService;
use App\Services\MailService;

use App\Repositories\OrderRepository;
use App\Repositories\OrderItemRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\PostalCodeRepository;
use App\Repositories\ShippingMethodRepository;


/**
 * Handler para la creación de órdenes de venta
 */
class OrderHandler
{
    public function __construct(
        private OrderRepository $orders,
        private OrderItemRepository $orderItems,
        private PaymentRepository $payments,
        private ProductRepository $products,
        private CustomerRepository $customers,
        private PostalCodeRepository $postalCodes,
        private ShippingMethodRepository $shippingMethods
    ) {}

    /**
     * Crear una orden completa (transacción)
     */
    public function create(array $data)
    {
        // =======================
        // VALIDACIÓN GLOBAL
        // =======================
        $validator = Validator::make($data, [
            'customer' => 'required|array',
            'customer.email' => 'required|email',
            'delivery' => 'required|array',
            'delivery.postal_code' => 'required|string',
            'dist_center_shipping_method_id' => 'required|integer|exists:dist_center_shipping_method,id',
            'items' => 'required|array|min:1',
            'payment' => 'required|array',
            'payment.method' => 'required|string',
            'payment.amount' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // ==========================================================
        // PRE-VALIDACIÓN DE STOCK (Antes de iniciar transacción)
        // ==========================================================
        foreach ($data['items'] as $item) {
            $product = $this->products->findById($item['product_id']);
            if (!$product || ($item['quantity'] > ($product->stock->stock ?? 0))) {
                throw new \Exception("Stock insuficiente para el producto: " . ($product->name));
            }
        }

        DB::beginTransaction();

        try {
            // =======================
            // CUSTOMER (crear o actualizar)
            // =======================
            $customerData = $data['customer'];

            $validator = Validator::make($customerData, [
                'nif' => 'required|string',
                'email' => 'required|email',
                'name' => 'required|string',
                'postal_code' => 'required|string',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $postalCode = $this->postalCodes->findByCode($customerData['postal_code']);
            if (!$postalCode) {
                throw new \Exception('Código postal del cliente no válido');
            }

            $customerData['postal_code_id'] = $postalCode->id;
            unset($customerData['postal_code']);

            $customer = $this->customers->findByEmail($customerData['email']);

            if ($customer) {
                $customer->update($customerData);
            } else {
                $customer = $this->customers->create($customerData);
            }

            // =======================
            // RELACIÓN MÉTODO DE ENVÍO Y CENTRO
            // =======================
            // Obtenemos la información del método de envío (precio) desde la tabla pivote
            $shippingRelation = DB::table('dist_center_shipping_method as dcsm')
                ->join('shipping_methods as sm', 'dcsm.shipping_method_id', '=', 'sm.id')
                ->where('dcsm.id', $data['dist_center_shipping_method_id'])
                ->select('sm.price', 'sm.name')
                ->first();

            if (!$shippingRelation) {
                throw new \Exception('La opción de envío seleccionada no es válida o ya no existe.');
            }

            // =======================
            // DIRECCIÓN DE ENVÍO
            // =======================
            $deliveryPostal = $this->postalCodes->findByCode($data['delivery']['postal_code']);
            if (!$deliveryPostal) {
                throw new \Exception('Código postal de entrega no válido');
            }

            // =======================
            // CALCULAR TOTALES
            // =======================
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);
                $subtotal += $product->price * $item['quantity'];

                // Descontar stock (Lógica global actual)
                $nuevoStock = $product->stock->stock - $item['quantity'];
                $product->stock()->update(['stock' => $nuevoStock]);
            }

            // --- LÓGICA DE IVA 21% ---
            $shippingPrice = $shippingRelation->price;
            $ivaPorcentaje = 0.21;

            $taxAmount = ($subtotal + $shippingPrice) * $ivaPorcentaje;
            $totalFinal = $subtotal + $shippingPrice + $taxAmount;

            // =======================
            // CREAR ORDEN
            // =======================
            $order = $this->orders->create([
                'customer_id' => $customer->id,
                'delivery_email' => $customerData['email'],
                'delivery_name' => $data['delivery']['name'],
                'delivery_nif' => $data['delivery']['nif'] ?? null,
                'delivery_phone' => $data['delivery']['phone'] ?? null,
                'delivery_address' => $data['delivery']['address'],
                'delivery_postal_code_id' => $deliveryPostal->id,
                'dist_center_shipping_method_id' => $data['dist_center_shipping_method_id'],
                'subtotal' => $subtotal,
                'shipping_price' => $shippingPrice,
                'total' => $totalFinal,
                'status' => 'pending'
            ]);

            // =======================
            // CREAR ITEMS Y PAGO
            // =======================
            foreach ($data['items'] as $item) {
                $product = $this->products->findById($item['product_id']);
                $this->orderItems->create([
                    'order_id'    => $order->id,
                    'product_id'  => $product->id,
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $product->price,
                    'total_price' => $product->price * $item['quantity']
                ]);
            }

            $this->payments->create([
                'order_id' => $order->id,
                'method'   => $data['payment']['method'],
                'amount'   => $totalFinal,
                'status'   => 'pending'
            ]);

            DB::commit();

            // =======================
            // LÓGICA DE PAYPAL
            // =======================
            $totalParaPaypal = number_format($totalFinal, 2, '.', '');
            if ($data['payment']['method'] === 'paypal') {
                $paypalService = new PayPalService();
                $paypalOrder = $paypalService->createOrder($totalParaPaypal);

                // VALIDACIÓN CRÍTICA:
                if (!isset($paypalOrder['id'])) {
                    // Logueamos el error para que tú como dev sepas qué pasó realmente
                    Log::error("Error de PayPal: ", (array)$paypalOrder);
                    throw new \Exception('No se pudo conectar con PayPal. Por favor, intenta más tarde.');
                }

                $this->payments->updateStatus($order->id, 'pending', ['paypal_order_id' => $paypalOrder['id']]);

                // Buscamos el link de aprobación de forma segura
                $approveLink = collect($paypalOrder['links'])->firstWhere('rel', 'approve');

                return [
                    'order_id' => $order->id,
                    'paypal' => [
                        'id' => $paypalOrder['id'],
                        'approve_url' => $approveLink ? $approveLink['href'] : null
                    ]
                ];
            }

            return ['order' => $order];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Capturar pago de PayPal
     */
    public function capturePaypalPayment(int $orderId, string $paypalOrderId)
    {
        Log::info("Iniciando captura PayPal. Order: $orderId, Token: $paypalOrderId");
        $order = $this->orders->findById($orderId);
        if (!$order) throw new \Exception('Orden no encontrada');

        $paypal = new PayPalService();
        $capture = $paypal->captureOrder($paypalOrderId);

        if (($capture['status'] ?? '') !== 'COMPLETED') {
            throw new \Exception('PayPal devolvió estado: ' . ($capture['status'] ?? 'NULL') . '. Respuesta completa: ' . json_encode($capture));
        }

        // 1. Actualizar estados
        $this->payments->updateStatus($orderId, 'completed', $capture);
        $order->update(['status' => 'completed']);

        // 2. Enviar correo
        try {
            $mailService = new MailService();
            $mailData = $this->prepareOrderMailData($order);
            $mailService->sendPurchaseMail($order->delivery_email, $mailData);
        } catch (\Exception $e) {
            // Loguear error de mail pero no cancelar la transacción del pago ya capturado
            Log::error("Error enviando correo de orden {$orderId}: " . $e->getMessage());
        }

        return $order;
    }

     /**
     * Listar todas las órdenes
     */
    public function list($perPage = 25)
    {
        // Pasamos el parámetro al repositorio
        return $this->orders->all($perPage);
    }

    /**
     * Obtener detalle de una orden
     */
    public function get(int $id)
    {
        return $this->orders->findById($id);
    }

    /**
     * Prepara los datos formateados para el servicio de correo
     */
    private function prepareOrderMailData($order): array
    {
        $order->load(['items.product', 'distributionCenterMethod.shippingMethod']);

        // 1. Obtener los items con sus nombres de producto
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'product_name' => $item->product->name,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->unit_price,
                'total_price'  => $item->total_price
            ];
        }

        // 2. Cálculos de Desglose de IVA
        // $order->total ya es el monto FINAL (Subtotal + Envío + IVA)
        $totalFinal = (float) $order->total;
        $ivaPorcentaje = 21;

        /**
         * Operación Inversa para desglosar:
         * Base Imponible = Total / 1.21
         * IVA = Total - Base Imponible
         */
        $totalSinIva = $totalFinal / 1.21;
        $ivaAmount   = $totalFinal - $totalSinIva;

        return [
            'order_number'      => $order->id,
            'customer_id'       => $order->customer_id,
            'customer_name'     => $order->delivery_name,
            'purchase_date'     => $order->created_at->format('d/m/Y'),
            'delivery_email'    => $order->delivery_email,
            'subtotal_products' => $order->subtotal, // Neto de productos
            'shipping' => [
                'method_name'   => $order->distributionCenterMethod->shippingMethod->name ?? 'Envío Estándar',
                'price'         => $order->shipping_price // Neto de envío
            ],
            'iva_percentage'    => $ivaPorcentaje,
            'iva_amount'        => number_format($ivaAmount, 2, '.', ''),
            'total_without_iva' => number_format($totalSinIva, 2, '.', ''),
            'total_with_iva'    => number_format($totalFinal, 2, '.', ''),
            'items'             => $items
        ];
    }
}
