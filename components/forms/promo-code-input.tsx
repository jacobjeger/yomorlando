"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Tag } from "lucide-react";
import { applyPromoCode } from "@/app/actions/promo";

interface PromoCodeInputProps {
  orderType: string;
  subtotal: number;
  shippingFee?: number;
  itemCount?: number;
  onApply: (promo: { promoId: string; code: string; discountAmount: number } | null) => void;
}

export function PromoCodeInput({ orderType, subtotal, shippingFee, itemCount, onApply }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<{ promoId: string; code: string; discountAmount: number } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError("");
    try {
      const result = await applyPromoCode(code, orderType, subtotal, { shippingFee, itemCount });
      if (!result.valid) {
        setError(result.error);
      } else {
        const promo = { promoId: result.promoId, code: result.code, discountAmount: result.discountAmount };
        setApplied(promo);
        onApply(promo);
      }
    } catch {
      setError("Failed to validate promo code");
    } finally {
      setChecking(false);
    }
  };

  const handleRemove = () => {
    setApplied(null);
    setCode("");
    setError("");
    onApply(null);
  };

  if (applied) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200">
        <Tag className="h-4 w-4 text-green-600" />
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
          {applied.code}
        </Badge>
        <span className="text-sm text-green-700 flex-1">
          −${(applied.discountAmount / 100).toFixed(2)} discount applied
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
          placeholder="Promo code"
          className="font-mono"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApply(); } }}
        />
        <Button type="button" variant="outline" onClick={handleApply} disabled={checking || !code.trim()}>
          {checking ? "..." : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
