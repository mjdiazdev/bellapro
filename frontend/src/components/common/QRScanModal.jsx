import React, { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Button from "./variant/Button";

export default function QRScanModal({ open, onClose }) {
  const [isMobile, setIsMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  
  const [code, setCode] = useState("");
  const [scannerRunning, setScannerRunning] = useState(false);
  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader-region";
  const navigate = useNavigate();

  // 1. handleProcess en el nivel superior y con reset de código
  const handleProcess = useCallback(
    (qrCode = code) => {
      const targetCode = qrCode?.trim();
      if (!targetCode) return;

      // 1. Limpiamos y cerramos el modal primero
      onClose();
      setCode("");

      // 2. Definimos la URL de destino
      const destination = `/store?qr=${targetCode}`;

      // 3. LÓGICA DE NAVEGACIÓN AGRESIVA
      // Si el usuario está en checkout, thanks o confirmación, forzamos recarga total
      const forceReloadPaths = ['/checkout', '/thanks', '/payment-confirm'];
      const shouldForce = forceReloadPaths.some(path => window.location.pathname.includes(path));

      if (shouldForce) {
        // Esto fuerza al navegador a cargar StorePage desde cero, ignorando bloqueos de React
        window.location.href = destination;
      } else {
        // Si ya está en la tienda o en el inicio, usamos la navegación suave
        navigate(destination);
        window.scrollTo(0, 0);
      }
    },
    [code, navigate, onClose]
  );

  // 2. Resetear el código cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      setCode(""); 
    }
  }, [open]);

  // 3. Efecto para detectar cambios de tamaño/dispositivo
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 4. Efecto principal del Scanner
  useEffect(() => {
    if (!open || !isMobile || scannerRunning) return;

    const timer = setTimeout(() => {
      const html5QrCode = new Html5Qrcode(qrRegionId);
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // No llamamos a setCode aquí directamente para evitar re-renders infinitos
            // Detenemos y procesamos
            html5QrCode.stop().then(() => {
               setScannerRunning(false);
               handleProcess(decodedText);
            }).catch(() => handleProcess(decodedText));
          },
          (errorMessage) => { /* Silencioso */ }
        )
        .then(() => setScannerRunning(true))
        .catch((err) => console.error("Error iniciando QR scanner:", err));
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        // Usamos una función anónima para limpiar sin bloquear el render
        const stopScanner = async () => {
            if (scannerRef.current?.isScanning) {
                await scannerRef.current.stop();
            }
            setScannerRunning(false);
        };
        stopScanner().catch(console.warn);
      }
    };
  }, [open, isMobile, handleProcess, scannerRunning]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isMobile ? "Escanear código QR" : "Ingresar código QR"}
        </h2>

        {!isMobile && (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingrese el código QR"
              className="w-full border rounded-lg p-3 focus:ring-pink focus:border-pink outline-none"
            />
            <Button fullWidth onClick={() => handleProcess()}>
              Procesar código
            </Button>
          </div>
        )}

        {isMobile && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Apunta la cámara al código QR
            </p>
            {/* El ID debe coincidir exactamente */}
            <div
              id={qrRegionId}
              className="w-full min-h-[300px] rounded-lg bg-gray-100 overflow-hidden border-2 border-dashed border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}