import React, { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Button from "./variant/Button";

export default function QRScanModal({ open, onClose }) {
  const [isMobile, setIsMobile] = useState(false);
  const [code, setCode] = useState("");
  const [scannerRunning, setScannerRunning] = useState(false);
  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader-region";
  const navigate = useNavigate();

  const handleProcess = useCallback(
    (qrCode = code) => {
      if (!qrCode.trim()) return;
      navigate(`/store?qr=${qrCode.trim()}`);
      onClose();
    },
    [code, navigate, onClose]
  );

  useEffect(() => {
    if (!open || !isMobile) return;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setCode(decodedText);
          handleProcess(decodedText);
        },
        (errorMessage) => {
          console.warn("QR scan error:", errorMessage);
        }
      )
      .then(() => setScannerRunning(true))
      .catch((err) => console.error("Error iniciando QR scanner:", err));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
      setScannerRunning(false);
    };
  }, [open, isMobile, handleProcess]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isMobile ? "Escanear código QR" : "Ingresar código QR"}
        </h2>

        {!isMobile && (
          <>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingrese el código QR"
              className="w-full border rounded-lg p-3 mb-4 focus:ring-pink focus:border-pink"
            />
            <Button fullWidth onClick={() => handleProcess()}>
              Procesar código
            </Button>
          </>
        )}

        {isMobile && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Abre la cámara para escanear un código QR
            </p>
            <div
              id={qrRegionId}
              className="w-full h-56 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
