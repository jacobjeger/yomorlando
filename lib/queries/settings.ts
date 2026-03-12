import { createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";
import type { SettingsKey, SiteSettings } from "@/lib/settings-defaults";

export type { SettingsKey, SiteSettings, KasheringPricing, LettucePricing, SurchargeRate, DeliveryOption } from "@/lib/settings-defaults";
export { DEFAULT_SETTINGS } from "@/lib/settings-defaults";

function isConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getAllSettings(): Promise<SiteSettings> {
  if (!isConfigured()) {
    return { ...DEFAULT_SETTINGS } as unknown as SiteSettings;
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");

    if (error || !data) {
      return { ...DEFAULT_SETTINGS } as unknown as SiteSettings;
    }

    const settings = { ...DEFAULT_SETTINGS } as unknown as Record<string, unknown>;
    for (const row of data) {
      if (row.key in DEFAULT_SETTINGS) {
        settings[row.key] = row.value;
      }
    }

    return settings as unknown as SiteSettings;
  } catch {
    return { ...DEFAULT_SETTINGS } as unknown as SiteSettings;
  }
}

export async function getSetting<K extends SettingsKey>(
  key: K
): Promise<SiteSettings[K]> {
  if (!isConfigured()) {
    return DEFAULT_SETTINGS[key] as unknown as SiteSettings[K];
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS[key] as unknown as SiteSettings[K];
    }

    return data.value as SiteSettings[K];
  } catch {
    return DEFAULT_SETTINGS[key] as unknown as SiteSettings[K];
  }
}
