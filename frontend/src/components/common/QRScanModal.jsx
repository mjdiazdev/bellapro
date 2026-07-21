import React, { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Button from "./variant/Button";

export default function QRScanModal({ open, onClose }) {
  const [isMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  
  const [code, setCode] = useState("");
  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader-region";
  const navigate = useNavigate();

  // Mantenemos tu handleProcess intacto pero agregamos el argumento para el QR directo
  const handleProcess = useCallback(
    (qrCode) => {
      // 1. Obtenemos el valor (del scanner o del input manual)
      let rawValue = qrCode?.trim() || code?.trim();
      if (!rawValue) return;

      // 2. LÓGICA DE LIMPIEZA: Extraer el ID si es una URL completa
      // Buscamos si el valor contiene "qr=" y tomamos lo que esté después
      let targetCode = rawValue;
      if (rawValue.includes("qr=")) {
        targetCode = rawValue.split("qr=")[1]; // Toma solo el "8"
      } 
      // Si la URL es de otro tipo pero termina en el ID, puedes usar una regex o URLSearchParams
      else if (rawValue.startsWith("http")) {
        try {
          const urlObj = new URL(rawValue);
          targetCode = urlObj.searchParams.get("qr") || rawValue;
        } catch (e) {
          console.error("Error parseando URL del QR", e);
        }
      }

      onClose();
      setCode("");

      // 3. Definimos el destino (ahora targetCode solo tendrá el "8")
      // Usamos la URL actual del navegador (localhost o IP) para mantener la consistencia
      const destination = `/store?qr=${targetCode}`;
      
      const forceReloadPaths = ['/checkout', '/thanks', '/payment-confirm'];
      const shouldForce = forceReloadPaths.some(path => window.location.pathname.includes(path));

      if (shouldForce) {
        window.location.href = destination;
      } else {
        navigate(destination);
        window.scrollTo(0, 0);
      }
    },
    [code, navigate, onClose]
  );

  useEffect(() => {
    if (!open) setCode("");
  }, [open]);

  // EFECTO DEL SCANNER: Ajustado para evitar el error de "not running"
  useEffect(() => {
    if (!open || !isMobile) return;

    let html5QrCode;

    const startScanner = async () => {
      try {
        // 1. Aumentamos un poco el delay para asegurar que el div esté listo en el DOM
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Verificamos que el div exista antes de instanciar
        if (!document.getElementById(qrRegionId)) return;

        html5QrCode = new Html5Qrcode(qrRegionId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // 2. IMPORTANTE: Validamos si está escaneando antes de detener
            if (html5QrCode && html5QrCode.isScanning) {
              html5QrCode.stop()
                .then(() => handleProcess(decodedText))
                .catch(() => handleProcess(decodedText));
            } else {
              handleProcess(decodedText);
            }
          },
          () => { /* Errores de frame ignorados para no saturar consola */ }
        );
      } catch (err) {
        console.error("Error con la cámara:", err);
      }
    };

    startScanner();

    return () => {
      // 3. Cleanup ultra-seguro
      if (html5QrCode) {
        const stopIfRunning = async () => {
          if (html5QrCode.isScanning) {
            try {
              await html5QrCode.stop();
            } catch (e) {
              console.warn("Error silencioso al apagar");
            }
          }
        };
        stopIfRunning();
      }
    };
  }, [open, isMobile, handleProcess]); // Agregamos handleProcess para que el callback sea fresco

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isMobile ? "Escanear código QR" : "Indica la página"}
        </h2>

        {!isMobile ? (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Número de página"
              className="w-full border rounded-lg p-3 focus:ring-pink focus:border-pink outline-none"
            />
            <Button fullWidth onClick={() => handleProcess()}>
              Ir a la página
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Apunta la cámara al código QR</p>
            <div
              id={qrRegionId}
              className="w-full min-h-[300px] rounded-lg bg-black overflow-hidden border-2 border-dashed border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}