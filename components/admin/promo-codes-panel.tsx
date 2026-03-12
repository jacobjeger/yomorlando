"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createPromoCode, updatePromoCode, deletePromoCode } from "@/app/actions/admin/promo";
import type { PromoCode } from "@/lib/database.types";
import { format } from "date-fns";

interface PromoCodesPanelProps {
  initialCodes: PromoCode[];
}

const EMPTY_FORM = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  min_order_amount: "",
  max_uses: "",
  applies_to: "all",
  valid_from: "",
  valid_until: "",
  is_active: true,
};

export function PromoCodesPanel({ initialCodes }: PromoCodesPanelProps) {
  const [codes, setCodes] = useState(initialCodes);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discount_value) return;
    setSaving(true);
    setError("");
    try {
      await createPromoCode({
        code: form.code,
        discount_type: form.discount_type,
        discount_value: form.discount_type === "percentage"
          ? Number(form.discount_value)
          : Math.round(Number(form.discount_value) * 100),
        min_order_amount: form.min_order_amount ? Math.round(Number(form.min_order_amount) * 100) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        applies_to: form.applies_to,
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      });
      // Optimistically add to list
      setCodes((prev) => [{
        id: crypto.randomUUID(),
        code: form.code.toUpperCase().trim(),
        discount_type: form.discount_type,
        discount_value: form.discount_type === "percentage"
          ? Number(form.discount_value)
          : Math.round(Number(form.discount_value) * 100),
        min_order_amount: form.min_order_amount ? Math.round(Number(form.min_order_amount) * 100) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        current_uses: 0,
        applies_to: form.applies_to as PromoCode["applies_to"],
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
        created_at: new Date().toISOString(),
      }, ...prev]);
      resetForm();
      setIsCreateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingId || !form.code.trim() || !form.discount_value) return;
    setSaving(true);
    setError("");
    try {
      await updatePromoCode(editingId, {
        code: form.code,
        discount_type: form.discount_type,
        discount_value: form.discount_type === "percentage"
          ? Number(form.discount_value)
          : Math.round(Number(form.discount_value) * 100),
        min_order_amount: form.min_order_amount ? Math.round(Number(form.min_order_amount) * 100) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        applies_to: form.applies_to,
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      });
      setCodes((prev) => prev.map((c) => c.id === editingId ? {
        ...c,
        code: form.code.toUpperCase().trim(),
        discount_type: form.discount_type,
        discount_value: form.discount_type === "percentage"
          ? Number(form.discount_value)
          : Math.round(Number(form.discount_value) * 100),
        min_order_amount: form.min_order_amount ? Math.round(Number(form.min_order_amount) * 100) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        applies_to: form.applies_to as PromoCode["applies_to"],
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
        is_active: form.is_active,
      } : c));
      setIsEditOpen(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await deletePromoCode(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (code: PromoCode) => {
    try {
      await updatePromoCode(code.id, { is_active: !code.is_active });
      setCodes((prev) => prev.map((c) => c.id === code.id ? { ...c, is_active: !c.is_active } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (code: PromoCode) => {
    setEditingId(code.id);
    setForm({
      code: code.code,
      discount_type: code.discount_type as "percentage" | "fixed",
      discount_value: code.discount_type === "percentage"
        ? String(code.discount_value)
        : String(code.discount_value / 100),
      min_order_amount: code.min_order_amount ? String(code.min_order_amount / 100) : "",
      max_uses: code.max_uses !== null ? String(code.max_uses) : "",
      applies_to: code.applies_to,
      valid_from: code.valid_from ? code.valid_from.slice(0, 16) : "",
      valid_until: code.valid_until ? code.valid_until.slice(0, 16) : "",
      is_active: code.is_active,
    });
    setError("");
    setIsEditOpen(true);
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discount_type === "percentage") return `${code.discount_value}%`;
    return `$${(code.discount_value / 100).toFixed(2)}`;
  };

  const formFields = (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Code</Label>
          <Input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="e.g. SAVE10"
          />
        </div>
        <div>
          <Label>Applies To</Label>
          <Select value={form.applies_to} onValueChange={(v) => setForm({ ...form, applies_to: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="tickets">Tickets Only</SelectItem>
              <SelectItem value="kashering">Kashering Only</SelectItem>
              <SelectItem value="lettuce">Lettuce Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Discount Type</Label>
          <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v as "percentage" | "fixed" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{form.discount_type === "percentage" ? "Discount (%)" : "Discount ($)"}</Label>
          <Input
            type="number"
            value={form.discount_value}
            onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
            placeholder={form.discount_type === "percentage" ? "e.g. 10" : "e.g. 25.00"}
            min="0"
            step={form.discount_type === "percentage" ? "1" : "0.01"}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Order ($, optional)</Label>
          <Input
            type="number"
            value={form.min_order_amount}
            onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label>Max Uses (optional)</Label>
          <Input
            type="number"
            value={form.max_uses}
            onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Valid From (optional)</Label>
          <Input
            type="datetime-local"
            value={form.valid_from}
            onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
          />
        </div>
        <div>
          <Label>Valid Until (optional)</Label>
          <Input
            type="datetime-local"
            value={form.valid_until}
            onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        <Label>Active</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {codes.length} promo code{codes.length !== 1 ? "s" : ""} &middot;{" "}
          {codes.filter((c) => c.is_active).length} active
        </p>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Promo Code</DialogTitle>
            </DialogHeader>
            {formFields}
            <Button onClick={handleCreate} disabled={saving || !form.code.trim() || !form.discount_value} className="w-full">
              {saving ? "Creating..." : "Create Promo Code"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No promo codes yet.
                  </TableCell>
                </TableRow>
              ) : (
                codes.map((code) => (
                  <TableRow key={code.id} className={!code.is_active ? "opacity-50" : ""}>
                    <TableCell className="font-mono font-bold">{code.code}</TableCell>
                    <TableCell>{formatDiscount(code)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{code.applies_to}</Badge>
                    </TableCell>
                    <TableCell>
                      {code.current_uses}{code.max_uses !== null ? ` / ${code.max_uses}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={code.is_active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(code)}
                      >
                        {code.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {code.valid_until ? format(new Date(code.valid_until), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(code)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setEditingId(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
          </DialogHeader>
          {formFields}
          <Button onClick={handleEdit} disabled={saving || !form.code.trim() || !form.discount_value} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
