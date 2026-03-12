import { getAllSettings } from "@/lib/queries/settings";
import { SettingsPanel } from "@/components/admin/settings-panel";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure pricing, form options, and other site-wide settings.
        </p>
      </div>
      <SettingsPanel initialSettings={settings} />
    </div>
  );
}
