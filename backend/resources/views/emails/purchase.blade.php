<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Confirmación de compra - BellaPro</title>
</head>

<body style="background-color:#f8f8f8; font-family: Arial, sans-serif; padding:0; margin:0;">

    <!-- Contenedor global -->
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <!-- BLOQUE SUPERIOR CON FONDO LILA SUAVE -->
                <div style="max-width:600px; margin:auto; background:#fff3f9; padding:20px; border-radius:8px;">
                    <!-- Logo -->
                    <div style="text-align:center;">
                        <img src="https://www.bellapro.es/cdn/shop/files/logo-elegido.png?v=1730546049&width=600" alt="BellaPro" width="180">
                    </div>

                    <hr style="border: none; border-top:2px solid #e91e63; margin:20px 0;">

                    <h2 style="text-align:center; font-weight:600; color:#333;">
                        Tu compra en BellaPro se realizó <br> correctamente. ¡Gracias!
                    </h2>

                    <p style="text-align:center; color:#666; font-size:14px; line-height:20px;">
                        Podrás ver los detalles de tu transacción junto con un enlace con las condiciones de la misma.
                        Imprime esta información y guárdala en un lugar seguro como referencia.
                    </p>

                    <!-- Datos principales -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                        <tr>
                            <td style="vertical-align:top; padding:15px;">
                                <p style="font-size:16px; font-weight:bold; color:#333; margin:0;">
                                    Número de pedido:<br>
                                    <span style="font-size:22px; font-weight:600;">
                                        {{ $data['order_number'] }}
                                    </span>
                                </p>
                            </td>

                            <td style="vertical-align:top; padding:15px;" align="right">
                                <div style="background:#f2f2f2; padding:10px; border-radius:5px; width:230px;">
                                    <p style="margin:0; font-size:14px; line-height:1.4;">
                                        <strong>Nombre:</strong> {{ $data['customer_name'] }} <br>
                                        <strong>Fecha de compra:</strong> {{ $data['purchase_date'] }}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <!-- Tabla -->
                    <table width="100%" style="margin-top:20px; border-collapse:collapse;">
                        <thead>
                            <tr style="background-color:#000; color:#fff;">
                                <th style="text-align:left; padding:10px 0; border-bottom:2px solid #000;">Detalles</th>
                                <th style="text-align:right; padding:10px 0; border-bottom:2px solid #000;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data['items'] as $item)
                            <tr>
                                <td style="padding:10px 0; color:#444;">
                                    {{ $item['qty'] }}x &nbsp; {{ $item['name'] }}
                                </td>
                                <td style="padding:10px 0; text-align:right;">
                                    €{{ number_format($item['price'], 2, ',', '.') }}
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>

                    <!-- Totales -->
                    <table width="100%" style="margin-top:10px;">
                        <tr>
                            <td style="text-align:right; color:#444; padding:4px 0;">
                                Subtotal:
                            </td>
                            <td style="text-align:right; padding:4px 0; width:120px;">
                                €{{ number_format($data['subtotal'], 2, ',', '.') }}
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align:right; color:#444; padding:4px 0;">
                                Envío ({{ $data['shipping']['method_name'] }}):
                            </td>
                            <td style="text-align:right; padding:4px 0;">
                                €{{ number_format($data['shipping']['price'], 2, ',', '.') }}
                            </td>
                        </tr>

                        @if(!empty($data['discount_amount']))
                        <tr>
                            <td style="text-align:right; color:#e91e63; padding:4px 0;">
                                Descuento aplicado:
                            </td>
                            <td style="text-align:right; padding:4px 0; color:#e91e63;">
                                -€{{ number_format($data['discount_amount'], 2, ',', '.') }}
                            </td>
                        </tr>
                        @endif

                        <tr>
                            <td style="text-align:right; color:#444; padding:4px 0;">
                                IVA (21%):
                            </td>
                            <td style="text-align:right; padding:4px 0;">
                                €{{ number_format($data['iva_amount'], 2, ',', '.') }}
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2" style="border-top:1px solid #ccc; padding-top:8px;"></td>
                        </tr>

                        <tr>
                            <td style="text-align:right; font-size:18px; font-weight:bold; padding-top:6px;">
                                Total:
                            </td>
                            <td style="text-align:right; font-size:18px; font-weight:bold; padding-top:6px;">
                                €{{ number_format($data['total_with_iva'], 2, ',', '.') }}
                            </td>
                        </tr>
                    </table>


                    <hr style="border: none; border-top:2px solid #e91e63; margin:20px 0;">

                </div>
                <!-- FOOTER CON FONDO LILA CLARO -->
                <div style="max-width:600px; margin:auto; background:#ffffff; padding:25px; border-radius:0 0 8px 8px;">
                    <!-- Mensaje legal -->
                    <p style="font-size:12px; color:#555; line-height:20px; margin:0;">

                        Este mensaje de correo electrónico se ha enviado desde una dirección que se utiliza solo para envíos.
                        No respondas este mensaje. Para obtener más información sobre tu cuenta, sigue los vínculos que aparecen a continuación.
                        <br><br>

                        <strong>Servicio técnico:</strong><br>
                        info@bella-online.es
                        <br><br>

                        <strong>Términos de servicio y Acuerdo de usuario:</strong><br>
                        https://www.bellapro.com/
                        <br><br>

                        <strong>Política de privacidad:</strong><br>
                        https://www.bellapro.com/
                        <br><br>

                        Este correo electrónico se ha enviado en nombre de BellaPro, una empresa registrada
                        en la Unión Europea con número de registro 06020283 y dirección de registro Madrid, Madrid.
                        Este correo electrónico se ha enviado desde una dirección que se utiliza solo para envíos.
                        No respondas este mensaje. Si tienes alguna pregunta, visita la página https://www.bellapro.com
                        <br><br>

                        © 2025 BellaPro
                    </p>

                </div>


            </td>
        </tr>
    </table>

</body>
</html>
