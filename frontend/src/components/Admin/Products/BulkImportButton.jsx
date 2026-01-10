import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { postAbsolute } from '../../../services/apiService';
import Button from '../../common/variant/Button'; 

export default function BulkImportButton({ onImportSuccess, onImportError }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['csv', 'xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      onImportError("Formato no permitido. Use CSV o Excel.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await postAbsolute('/products/import', formData);
      onImportSuccess(res.message || "Importación completada");
      e.target.value = ''; // Limpiar input
    } catch (error) {
      const msg = error.response?.data?.error || "Error al procesar el archivo";
      onImportError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Input oculto */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".csv, .xlsx, .xls"
        onChange={handleFileChange}
      />

      {/* Botón con tu estilo personalizado */}
      <Button 
        width="180px" 
        onClick={handleButtonClick}
        disabled={loading}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {loading ? 'Subiendo...' : 'Carga Masiva'}
        </div>
      </Button>
    </>
  );
}