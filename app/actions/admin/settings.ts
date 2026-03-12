"use server";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, type SettingsKey } from "@/lib/queries/settings";
import { revalidatePath } from "next/cache";

const VALID_KEYS = Object.keys(DEFAULT_SETTINGS) as SettingsKey[];

export async function updateSetting(key: string, value: unknown) {
  if (!VALID_KEYS.includes(key as SettingsKey)) {
    throw new Error(`Invalid setting key: ${key}`);
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value: value as Record<string, unknown>, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    throw new Error(`Failed to update setting: ${error.message}`);
  }

  // Revalidate pages that use settings
  revalidatePath("/", "layout");

  return { success: true };
}
