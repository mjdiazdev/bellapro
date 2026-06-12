import { useState, useEffect } from "react";
// 1. Importar useNavigate de react-router-dom
import { useNavigate } from "react-router-dom"; 
import CheckoutHeader from "../../../components/common/HeaderClient";
import BillingForm from "../../../components/Client/Checkout/BillingForm";
import ShippingForm from "../../../components/Client/Checkout/ShippingForm";
import ShippingMethod from "../../../components/Client/Checkout/ShippingMethod";
import PaymentMethod from "../../../components/Client/Checkout/PaymentMethod";
import CouponInput from "../../../components/Client/Checkout/CouponInput";
import OrderSummary from "../../../components/Client/Checkout/OrderSummary";
import Footer from "../../../components/common/Footer";
import EmailCheckout from "../../../components/Client/Checkout/EmailCheckout";
import { createItem } from "../../../services/apiService";
import { useCart } from "../../../context/CartContext";
import Button from "../../../components/common/variant/Button";

export default function CheckoutPage() {
  const { cartProducts, clearCart } = useCart();
  // 2. Inicializar el hook de navegación
  const navigate = useNavigate(); 

  const productsInCart = cartProducts.filter(p => p.quantity > 0);

  const [customer, setCustomer] = useState(null);

  // --- LOGICA DE SINCRONIZACIÓN DE CLIENTE ---
  useEffect(() => {
    if (!customer) return;

    setBillingForm(prev => ({
      ...prev,
      nif: customer.nif || "",
      name: customer.name || "",
      phone: customer.phone || "",
      address: customer.address || "",
      address_extra: customer.address_extra || "",
      postal_code: customer.postal_code?.code || customer.postal_code || "",
      province_id: customer.postal_code?.city?.province?.id || "",
      city_id: customer.postal_code?.city?.id || "",
      postal_code_id: customer.postal_code?.id || ""
    }));
  }, [customer]);

  const [shippingDifferent, setShippingDifferent] = useState(false);

  const [billingForm, setBillingForm] = useState({
    nif: "",
    email: "",
    name: "",
    phone: "",
    address: "",
    address_extra: "",
    postal_code: "",
    province_id: "",
    city_id: "",
    postal_code_id: ""
  });

  const [shippingForm, setShippingForm] = useState({
    nif: "",
    name: "",
    address: "",
    address_extra: "",
    phone: "",
    postal_code: "",
    province_id: "",
    city_id: "",
    postal_code_id: ""
  });

  const [selectedPayment, setSelectedPayment] = useState({
    method: "paypal",
    amount: productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    details: { intent: "CAPTURE" }
  });

  // Estado para el código postal activo
  const [activePostalCode, setActivePostalCode] = useState("");

  useEffect(() => {
    // Si la dirección de envío es diferente, mandamos el CP de ShippingForm
    // Si es la misma, mandamos el CP de BillingForm
    const cp = shippingDifferent ? shippingForm.postal_code : billingForm.postal_code;
    setActivePostalCode(cp);
  }, [shippingDifferent, shippingForm.postal_code, billingForm.postal_code]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 1. Añadimos el estado de control de carga
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PROCESAR ORDEN ---
  const handlePlaceOrder = async () => {
    
    // 2. PROTECCIÓN INICIAL: Si ya está procesando, salimos de la función
    if (isProcessing) return;

    // 3. VALIDACIONES INICIALES (Igual que antes)
    if (!customer?.email) return alert("Debes ingresar un cliente válido");
    if (productsInCart.length === 0) return alert("El carrito está vacío");
    if (!billingForm.nif || !billingForm.postal_code) return alert("Completa los datos de facturación");
    if (shippingDifferent && !shippingForm.postal_code) return alert("Completa los datos de envío");
    if (!selectedShippingId) return alert("Por favor, selecciona un método de envío");

    try {
      // 4. ACTIVAMOS LA CARGA: Esto bloquea reintentos inmediatos
      setIsProcessing(true);

      const billingData = {
        nif: billingForm.nif,
        email: customer.email,
        name: billingForm.name,
        phone: billingForm.phone,
        address: billingForm.address,
        address_extra: billingForm.address_extra,
        postal_code: billingForm.postal_code 
      };

      const deliveryData = shippingDifferent
        ? {
            nif: shippingForm.nif,
            name: shippingForm.name,
            phone: shippingForm.phone,
            address: shippingForm.address,
            address_extra: shippingForm.address_extra,
            postal_code: shippingForm.postal_code 
          }
        : { ...billingData };

      const payload = {
        customer: billingData,
        delivery: deliveryData,
        dist_center_shipping_method_id: selectedShippingId,
        items: productsInCart.map(p => ({
          product_id: p.id,
          quantity: p.quantity
        })),
        payment: {
          ...selectedPayment,
          amount: selectedPayment.amount,
        },
        ...(appliedCoupon ? { coupon_code: appliedCoupon.code } : {}),
      };

      // 5. LLAMADA AL BACKEND
      const response = await createItem("orders", payload);
      const result = response.data; 

      if (!result) throw new Error("No se recibió respuesta del servidor.");

      if (selectedPayment.method === 'paypal' && result.paypal?.approve_url) {
        localStorage.setItem("pending_order_id", result.order_id);
        window.location.href = result.paypal.approve_url;

      } else if (selectedPayment.method === 'redsys' && result.redsys) {
        localStorage.setItem("redsys_order_id", result.order_id);

        // Auto-submit hacia la pasarela Redsys (igual que en formulario Hosted)
        const { url, merchantParameters, signature, signatureVersion } = result.redsys;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;

        const fields = {
          Ds_SignatureVersion:   signatureVersion,
          Ds_MerchantParameters: merchantParameters,
          Ds_Signature:          signature,
        };

        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type  = 'hidden';
          input.name  = name;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

      } else {
        clearCart();
        navigate("/thanks", { replace: true });
      }

    } catch (error) {
      // 6. IMPORTANTE: Si hay un error, debemos liberar el botón 
      // para que el usuario pueda corregir y reintentar.
      setIsProcessing(false);
      
      console.error("Error detallado:", error);
      alert(
        "Error al registrar la orden: " +
        (error.response?.data?.message || error.message)
      );
    }
  };
  const [shippingMethods, setShippingMethods] = useState([]); // Guardar la lista completa
  const [selectedShippingId, setSelectedShippingId] = useState(null);

  // Buscamos el objeto del método seleccionado para pasarlo al resumen
  const currentShippingMethod = shippingMethods.find(m => m.id === selectedShippingId);

  // Recalcular el monto para el payload de pago cada vez que cambie el envío o el carrito
  useEffect(() => {
    // 1. Calculamos el subtotal de productos
    const subtotal = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    
    // 2. Obtenemos el precio del envío
    const shipping = currentShippingMethod ? Number(currentShippingMethod.price) : 0;
    
    // 3. Calculamos base + IVA (21%) con descuento si hay cupón
    const discount    = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0;
    const totalConIva = (subtotal + shipping - discount) * 1.21;

    // 4. Actualizamos el estado del pago
    setSelectedPayment(prev => ({
      ...prev,
      amount: totalConIva.toFixed(2)
    }));
  }, [currentShippingMethod, productsInCart, appliedCoupon, setSelectedPayment]);

  return (
    <div className="min-h-screen">
      <CheckoutHeader />

      <div className="max-w-6xl mx-auto px-6 py-10 pt-[80px] grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="order-2 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <OrderSummary
              selectedShippingMethod={currentShippingMethod}
              discount={appliedCoupon?.discount_amount ?? 0}
            />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">¿Tienes un cupón de descuento?</h3>
              <CouponInput
                items={productsInCart.map(p => ({ product_id: p.id, quantity: p.quantity }))}
                subtotal={productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0)}
                appliedCoupon={appliedCoupon}
                onCouponApplied={setAppliedCoupon}
                onCouponRemoved={() => setAppliedCoupon(null)}
              />
            </div>

            <Button
              onClick={handlePlaceOrder}
              fullWidth
              className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : `Completar Pago (${selectedPayment.amount}€)`}
            </Button>
          </div>
        </div>

        <div className="space-y-10 order-1 lg:order-1">
          <EmailCheckout onCustomerLoaded={setCustomer} />
          <BillingForm
            billingForm={billingForm}
            setBillingForm={setBillingForm}
            shippingDifferent={shippingDifferent}
            setShippingDifferent={setShippingDifferent}
          />
          {shippingDifferent && (
            <ShippingForm
              billingCustomer={billingForm}
              shippingForm={shippingForm}
              setShippingForm={setShippingForm}
            />
          )}
          <ShippingMethod
            selectedShipping={selectedShippingId}
            setSelectedShipping={setSelectedShippingId}
            onMethodsLoaded={(methods) => setShippingMethods(methods)}
            postalCode={activePostalCode}
          />
          <PaymentMethod
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}