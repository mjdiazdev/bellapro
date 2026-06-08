import React from "react";
import RadioCard from "../../common/variant/RadioCard";
import visa from "../../../assets/visa.png";
import mastercard from "../../../assets/mastercard.png";
import paypal from "../../../assets/paypal.png";

const RadioDot = ({ active }) => (
  <span
    className={`w-4 h-4 rounded-full border flex items-center justify-center
    ${active ? "border-pink" : "border-gray-300"}`}
  >
    {active && <span className="w-2 h-2 rounded-full bg-pink" />}
  </span>
);

const PaymentMethod = ({ selectedPayment, setSelectedPayment }) => {
  const method = selectedPayment?.method ?? "paypal";

  const selectMethod = (value) => {
    setSelectedPayment((prev) => ({ ...prev, method: value }));
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Método de pago
      </h2>

      <div className="bg-white rounded-xl shadow-sm divide-y">

        {/* TARJETA BANCARIA — Redsys */}
        <div className="p-4 space-y-4">
          <RadioCard
            title="Tarjeta bancaria"
            value="redsys"
            selected={method === "redsys"}
            onChange={() => selectMethod("redsys")}
            icon={<RadioDot active={method === "redsys"} />}
            icons={
              <div className="flex space-x-2">
                <img src={visa} className="w-6" alt="Visa" />
                <img src={mastercard} className="w-6" alt="Mastercard" />
              </div>
            }
          />
          {method === "redsys" && (
            <div className="pl-6 text-sm text-gray-600">
              Pago seguro mediante TPV virtual de CaixaBank (Redsys). Serás
              redirigido a la pasarela bancaria para completar el pago con tu
              tarjeta.
            </div>
          )}
        </div>

        {/* PAYPAL */}
        <div className="p-4 space-y-4">
          <RadioCard
            title="PayPal"
            value="paypal"
            selected={method === "paypal"}
            onChange={() => selectMethod("paypal")}
            icon={<RadioDot active={method === "paypal"} />}
            icons={<img src={paypal} className="w-8" alt="PayPal" />}
          />
          {method === "paypal" && (
            <div className="pl-6 text-sm text-gray-600">
              Después de hacer clic en <strong>Completar Pago</strong>, serás
              redirigido a PayPal para completar tu compra de forma segura.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default PaymentMethod;
