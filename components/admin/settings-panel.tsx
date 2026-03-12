"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, X } from "lucide-react";
import { EditableList } from "@/components/admin/editable-list";
import { DeliveryOptionsEditor } from "@/components/admin/delivery-options-editor";
import { updateSetting } from "@/app/actions/admin/settings";
import { useToast } from "@/hooks/use-toast";
import type { SiteSettings, DeliveryOption } from "@/lib/settings-defaults";

interface SettingsPanelProps {
  initialSettings: SiteSettings;
}

export function SettingsPanel({ initialSettings }: SettingsPanelProps) {
  const { toast } = useToast();

  // Pricing state
  const [kasheringPricing, setKasheringPricing] = useState(initialSettings.kashering_pricing);
  const [lettucePricing, setLettucePricing] = useState(initialSettings.lettuce_pricing);
  const [surchargeRate, setSurchargeRate] = useState(initialSettings.surcharge_rate);

  // Form options state
  const [howHeardOptions, setHowHeardOptions] = useState<string[]>([...initialSettings.how_heard_options]);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(
    initialSettings.ticket_delivery_options.map((o) => ({ ...o }))
  );
  const [kasheringDevs, setKasheringDevs] = useState<string[]>([...initialSettings.kashering_developments]);
  const [lettuceDevs, setLettuceDevs] = useState<string[]>([...initialSettings.lettuce_developments]);
  const [donationPresets, setDonationPresets] = useState<number[]>([...initialSettings.donation_presets]);

  // Saving state
  const [saving, setSaving] = useState<string | null>(null);

  const save = async (key: string, value: unknown) => {
    setSaving(key);
    try {
      await updateSetting(key, value);
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({
        title: "Error saving settings",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const SaveButton = ({ settingKey, value }: { settingKey: string; value: unknown }) => (
    <Button
      onClick={() => save(settingKey, value)}
      disabled={saving !== null}
      className="gap-2"
    >
      {saving === settingKey ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      Save
    </Button>
  );

  return (
    <Tabs defaultValue="pricing" className="space-y-6">
      <TabsList>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="form-options">Form Options</TabsTrigger>
      </TabsList>

      {/* Pricing Tab */}
      <TabsContent value="pricing" className="space-y-6">
        {/* Kashering Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Kashering Pricing</CardTitle>
            <CardDescription>Base prices and discounts for villa kashering orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Base Price per House ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(kasheringPricing.base_price / 100).toFixed(2)}
                  onChange={(e) =>
                    setKasheringPricing((p) => ({
                      ...p,
                      base_price: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Solara Member Discount ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(kasheringPricing.solara_discount / 100).toFixed(2)}
                  onChange={(e) =>
                    setKasheringPricing((p) => ({
                      ...p,
                      solara_discount: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Ring Set Price ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(kasheringPricing.ring_set_price / 100).toFixed(2)}
                  onChange={(e) =>
                    setKasheringPricing((p) => ({
                      ...p,
                      ring_set_price: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Counter Roll Price ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(kasheringPricing.counter_roll_price / 100).toFixed(2)}
                  onChange={(e) =>
                    setKasheringPricing((p) => ({
                      ...p,
                      counter_roll_price: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton settingKey="kashering_pricing" value={kasheringPricing} />
            </div>
          </CardContent>
        </Card>

        {/* Lettuce Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Lettuce Pricing</CardTitle>
            <CardDescription>Pricing for checked lettuce bags and delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Price per Bag ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(lettucePricing.price_per_bag / 100).toFixed(2)}
                  onChange={(e) =>
                    setLettucePricing((p) => ({
                      ...p,
                      price_per_bag: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Delivery Fee ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(lettucePricing.delivery_fee / 100).toFixed(2)}
                  onChange={(e) =>
                    setLettucePricing((p) => ({
                      ...p,
                      delivery_fee: Math.round(parseFloat(e.target.value || "0") * 100),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SaveButton settingKey="lettuce_pricing" value={lettucePricing} />
            </div>
          </CardContent>
        </Card>

        {/* Surcharge Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Surcharge</CardTitle>
            <CardDescription>Optional surcharge percentage applied to all order types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs">
              <Label>Surcharge Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={(surchargeRate.rate * 100).toFixed(1)}
                onChange={(e) =>
                  setSurchargeRate({ rate: parseFloat(e.target.value || "0") / 100 })
                }
              />
            </div>
            <div className="flex justify-end">
              <SaveButton settingKey="surcharge_rate" value={surchargeRate} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Form Options Tab */}
      <TabsContent value="form-options" className="space-y-6">
        {/* How Heard Options */}
        <Card>
          <CardHeader>
            <CardTitle>&quot;How Did You Hear About Us&quot; Options</CardTitle>
            <CardDescription>Options shown in the ticket order form dropdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableList
              items={howHeardOptions}
              onChange={setHowHeardOptions}
              placeholder="Add option..."
            />
            <div className="flex justify-end">
              <SaveButton settingKey="how_heard_options" value={howHeardOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Ticket Delivery Options */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Delivery Options</CardTitle>
            <CardDescription>Delivery methods and fees for ticket orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DeliveryOptionsEditor
              options={deliveryOptions}
              onChange={setDeliveryOptions}
            />
            <div className="flex justify-end">
              <SaveButton settingKey="ticket_delivery_options" value={deliveryOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Kashering Developments */}
        <Card>
          <CardHeader>
            <CardTitle>Kashering Developments</CardTitle>
            <CardDescription>Development options shown in the kashering order form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableList
              items={kasheringDevs}
              onChange={setKasheringDevs}
              placeholder="Add development..."
            />
            <div className="flex justify-end">
              <SaveButton settingKey="kashering_developments" value={kasheringDevs} />
            </div>
          </CardContent>
        </Card>

        {/* Lettuce Developments */}
        <Card>
          <CardHeader>
            <CardTitle>Lettuce Delivery Developments</CardTitle>
            <CardDescription>Development options for lettuce delivery orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableList
              items={lettuceDevs}
              onChange={setLettuceDevs}
              placeholder="Add development..."
            />
            <div className="flex justify-end">
              <SaveButton settingKey="lettuce_developments" value={lettuceDevs} />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Donation Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Preset Amounts</CardTitle>
            <CardDescription>Quick-select donation amounts shown on the donation page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DonationPresetsEditor
              amounts={donationPresets}
              onChange={setDonationPresets}
            />
            <div className="flex justify-end">
              <SaveButton settingKey="donation_presets" value={donationPresets} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function DonationPresetsEditor({
  amounts,
  onChange,
}: {
  amounts: number[];
  onChange: (amounts: number[]) => void;
}) {
  const [newAmount, setNewAmount] = useState("");

  const addAmount = () => {
    const num = parseFloat(newAmount);
    if (isNaN(num) || num <= 0 || amounts.includes(num)) return;
    const updated = [...amounts, num].sort((a, b) => a - b);
    onChange(updated);
    setNewAmount("");
  };

  const removeAmount = (index: number) => {
    onChange(amounts.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {amounts.map((amount, index) => (
          <div
            key={`${amount}-${index}`}
            className="flex items-center gap-1 bg-muted/50 rounded-md px-3 py-1.5"
          >
            <span className="text-sm font-medium">${amount}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-destructive hover:text-destructive"
              onClick={() => removeAmount(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-w-xs">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
          <Input
            type="number"
            min="1"
            step="1"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="0"
            className="pl-7"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmount();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={addAmount}>
          Add
        </Button>
      </div>
    </div>
  );
}
