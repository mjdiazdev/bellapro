import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import api from "../../../services/api";

export default function CouponInput({ items, subtotal, onCouponApplied, onCouponRemoved, appliedCoupon }) {
  const [code, setCode]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/coupons/validate", { code: code.trim(), items });
      onCouponApplied({
        code:            res.data.code,
        discount_amount: res.data.discount_amount,
        message:         res.data.message,
      });
      setCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Cupón no válido.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setError("");
    onCouponRemoved();
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <Check className="w-4 h-4" />
          <span>{appliedCoupon.code}</span>
          <span className="text-green-600 font-normal">— {appliedCoupon.message}</span>
        </div>
        <button onClick={handleRemove} className="text-green-500 hover:text-red-500 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Código de cupón"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-pink-500 text-white text-sm font-medium rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "..." : "Aplicar"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}
