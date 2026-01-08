import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const FaqItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[1.13rem] text-black">{title}</span>
        {isOpen ? (
          <X className="text-gray-400" size={24} />
        ) : (
          <Plus className="text-gray-400" size={24} />
        )}
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 pt-4 text-gray-600 text-[0.75rem] leading-relaxed border-t border-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export const FaqsContent = () => (
  <div className="mt-8">
    <FaqItem title="Formas de pago">
      <p className="mb-4">
        Pago con tarjeta: disponemos de un sistema de pago sencillo y seguro mediante tarjeta de crédito Visa o Mastercard. Toda la información que nos transmitas viaja cifrada a través de Internet. Así mismo, los datos sobre tu tarjeta no quedan registrados en ninguna base de datos, sino que van directamente al TPV del banco.
      </p>
      <p>
        Pago con Paypal: pago on-line inmediato. Es imprescindible que la dirección de envío coincida con la dirección de envío registrada en su cuenta de PAY PAL. Sólo enviamos pedido a direcciones registradas en PAY PAL.
      </p>
    </FaqItem>

    <FaqItem title="Gastos de envío">
      <p>Pedidos cuyo importe sea entre 0 € y 40 € (impuestos incluidos); los gastos de transporte serán 5€ (hasta 20 kilos) en España peninsular</p>
      <p>Pedidos superiores a 40€ (impuestos incluidos); el transporte es GRATIS en España peninsular</p>
    </FaqItem>

    <FaqItem title="Plazo de entrega">
      <p>
        Plazo para España peninsular: 
        para los códigos postales en radio de 1.5km de la tienda física en menos de 2 horas; 
        para la provincia Comunidad de Madrid 24h (días hábiles); 
        para otras provincias 24-48 horas (días hábiles); 
        Plazo para Portugal: 
        48h (días hábiles) 
        Los pedidos cuentan con un seguro de envío incluido cuyo coste absorbe Bellapro Universal, S.A.
        </p>
    </FaqItem>

    <FaqItem title="Devoluciones">
      <p>Rogamos a los usuarios verificar cuidadosamente los pedidos y si tienen alguna duda se pongan en contacto con nosotros vía correo
        electrónico o por teléfono para evitar las devoluciones. No obstante, si las mercancías han sido pedidas por error o no son como las 
        esperaba, ha de ponerse en contacto con nuestro servicio de atención al cliente 91 468 23 14. Los productos deben ser devueltos dentro
        de los 7 días siguientes a la recepción del pedido, sin haber sido utilizados, en perfecto estado y en su embalaje original. El 
        transporte de devolución como el de reposición lo pagará el usuario. Bellapro Universal, S.A. no se hace responsable de los artículos
        perdidos o dañados durante el tránsito de devolución, por tanto, le aconsejamos que embale bien las mercancías y las asegure con la 
        compañía de transportes.
        Debido a normas de higiene, no podemos aceptar devoluciones de herramientas de corte como tijeras, alicates, pinzas, navajas, etc., que
        hayan sido utilizados.
      </p>
    </FaqItem>

    <FaqItem title="Garantía">
      <p>
        La garantía contractual ofrecida es la que habitualmente concede el proveedor de acuerdo a los términos de la Ley 23/2003 de 10 de Julio, de Garantías en la Venta de Bienes de Consumo y el Real Decreto Legislativo 1/2007 de 16 de Noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias, que reconoce al consumidor el derecho a la reparación del bien, a su sustitución, a la rebaja del precio o a la resolución del contrato, gestiones que serán gratuitas para el consumidor.
      </p>

      <p>
        La garantía perderá su vigencia si las deficiencias han sido ocasionadas por negligencias, golpes, uso o manipulaciones indebidas, conexión a tensión no idónea o instalación incorrecta. Tampoco están sujetas a garantía las piezas sometidas a desgaste por su uso normal.
      </p>

      <p>
        Todos los productos están garantizados según la garantía del fabricante. Los artículos defectuosos que aún están bajo la garantía del fabricante deben ser notificados y devueltos para su inspección, antes de una reparación, un cambio o un reembolso.
      </p>

      <p>
        Procedimiento a seguir
      </p>

      <p>
        Llame al número de teléfono 91 468 23 14 de atención al cliente.
      </p>

      <p>
        En caso de tener el artículo algún defecto o fallo, procederemos de manera inmediata a tramitar su garantía.
      </p>

      <p>
        Una vez tengamos el artículo, este pasara al servicio técnico oficial de la marca, ellos repararan el artículo en un plazo que no podemos determinar pues depende del problema que pudiera llegar a tener el artículo. Es por ello por lo que el tiempo de entrega del artículo lo determina el servicio técnico correspondiente.
      </p>

      <p>
        Reparado el artículo procederemos en 24-36 horas laborables a entregárselo.
      </p>

      <p>
        Los aparatos eléctricos usados no se cambian, sino que se reparan.
      </p>
    </FaqItem>
  </div>
);