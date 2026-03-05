import { useState } from "react";
import AdminTable from "../../common/AdminTable";
import ProductDetailsModal from "./ProductDetailsModal";

export default function ProductsList({ products, onEdit, onDelete, onLocalChange, onSaveAll }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const columns = [
    {
      header: 'Imagen',
      key: 'image_url',
      render: (p) => (
        <img 
          src={p.image_url || 'https://yayasansapa.id/wp-content/uploads/2017/12/no-image-found-360x250.png'} 
          alt={p.name}
          className="w-10 h-10 object-cover rounded-md border border-gray-200"
          onError={(e) => { e.target.src = 'https://yayasansapa.id/wp-content/uploads/2017/12/no-image-found-360x250.png'; }}
        />
      )
    },
    { header: 'Referencia', key: 'reference' },
    { header: 'Nombre', key: 'name' },
    
    // --- COLUMNA PRECIO EDITABLE ---
    { 
      header: 'Precio (€)', 
      key: 'price',
      render: (p) => (
        <input 
          type="number" 
          value={p.price}
          step="0.01"
          className="w-24 p-2 border border-gray-200 rounded focus:border-pink focus:outline-none transition-colors"
          onChange={(e) => onLocalChange(p.id, 'price', e.target.value)}
        />
      )
    },

    // --- COLUMNA STOCK EDITABLE ---
    { 
      header: 'Stock Actual', 
      key: 'stock',
      render: (p) => (
        <input 
          type="number" 
          value={p.stock?.stock ?? 0}
          className="w-20 p-2 border border-gray-200 rounded focus:border-pink focus:outline-none transition-colors"
          onChange={(e) => onLocalChange(p.id, 'stock', Number(e.target.value))}
        />
      )
    },

    // --- NUEVA COLUMNA STATUS (CHECKBOX) ---
    {
      header: 'Estado',
      key: 'status',
      render: (p) => (
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox"
            checked={Boolean(p.status)}
            className="w-5 h-5 accent-pink cursor-pointer"
            onChange={(e) => onLocalChange(p.id, 'status', e.target.checked)}
          />
          <span className={`text-[10px] font-bold uppercase ${p.status ? 'text-green-600' : 'text-red-500'}`}>
            {p.status ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      )
    },

    { 
      header: 'Categoría', 
      key: 'category',
      render: (p) => (
        <span className="text-pink border border-pink/30 px-2 py-1 rounded text-xs uppercase font-medium">
          {p.category?.name || 'S/N'}
        </span>
      )
    },
  ];

  return (
    <div className="">
      <AdminTable 
        columns={columns}
        data={products} 
        onEdit={onEdit}
        onDelete={onDelete}
        onView={(p) => setSelectedProduct(p.id)}
        isEditable={true}
        onSaveAll={onSaveAll}
      />

      {selectedProduct && (
        <ProductDetailsModal 
          productId={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}