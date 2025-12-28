import React, { useState } from "react";
import RadioCard from "../../common/variant/RadioCard";
import Input from "../../common/variant/Input";
import Button from "../../common/variant/Button";
import visa from "../../../assets/visa.png";
import mastercard from "../../../assets/mastercard.png";
import paypal from "../../../assets/paypal.png";

const PaymentMethod = () => {
  const [method, setMethod] = useState("visa");

  const RadioDot = ({ active }) => (
    <span
      className={`w-4 h-4 rounded-full border flex items-center justify-center
      ${active ? "border-pink" : "border-gray-300"}`}
    >
      {active && <span className="w-2 h-2 rounded-full bg-pink" />}
    </span>
  );

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Método de pago
      </h2>

      {/* CONTENEDOR ÚNICO */}
      <div className="bg-white rounded-xl shadow-sm divide-y">

        {/* VISA */}
        <div className="p-4 space-y-4">
          <RadioCard
            title="Visa"
            value="visa"
            selected={method === "visa"}
            onChange={() => setMethod("visa")}
            icon={<RadioDot active={method === "visa"} />}
            icons={
              <div className="flex space-x-2">
                <img src={mastercard} className="w-6" alt="Mastercard" />
                <img src={visa} className="w-6" alt="Visa" />
              </div>
            }
          />

          {method === "visa" && (
            <div className="space-y-3 pl-6">
              <Input placeholder="Número de tarjeta" />

              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Fecha de expiración" />
                <Input placeholder="Código de seguridad" />
              </div>

              <Input placeholder="Titular de la tarjeta" />

              <Button fullWidth>Pagar ahora</Button>
            </div>
          )}
        </div>

        {/* PAYPAL */}
        <div className="p-4 space-y-4">
          <RadioCard
            title="Paypal"
            value="paypal"
            selected={method === "paypal"}
            onChange={() => setMethod("paypal")}
            icon={<RadioDot active={method === "paypal"} />}
            icons={<img src={paypal} className="w-8" alt="Paypal" />}
          />

          {method === "paypal" && (
            <div className="pl-6 text-sm text-gray-600">
              Después de hacer clic en <strong>Pagar con PayPal</strong>, se te
              redirigirá a PayPal para completar tu compra de forma segura.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default PaymentMethod;
