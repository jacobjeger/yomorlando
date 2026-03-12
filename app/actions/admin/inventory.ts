"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email";

export async function toggleWaitlist(eventId: string, isActive: boolean) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("lettuce_inventory")
    .update({ is_waitlist_active: isActive })
    .eq("event_id", eventId);

  if (error) {
    throw new Error("Failed to toggle waitlist");
  }
}

export async function sendWaitlistBlast(eventId: string) {
  const supabase = createServiceClient();

  const { data: entries, error } = await supabase
    .from("lettuce_waitlist")
    .select("name, email, bags_requested")
    .eq("event_id", eventId);

  if (error || !entries || entries.length === 0) {
    throw new Error("No waitlist entries found");
  }

  const { data: event } = await supabase
    .from("events")
    .select("name, year")
    .eq("id", eventId)
    .single();

  const eventName = event ? `${event.name} ${event.year}` : "YoM Orlando";

  const results = await Promise.allSettled(
    entries.map((entry) =>
      resend.emails.send({
        from: "YoM Orlando <noreply@yomorlando.com>",
        to: entry.email,
        subject: `YoM Orlando — Checked Lettuce Now Available!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Great News, ${entry.name}!</h2>
            <p>Checked lettuce is now available for <strong>${eventName}</strong>.</p>
            <p>You requested <strong>${entry.bags_requested} bag(s)</strong>. Head to our website to place your order before supplies run out!</p>
            <p style="margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://yomorlando.com"}/pesach/lettuce"
                 style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                Order Now
              </a>
            </p>
            <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
              Thank you,<br/>YoM Orlando Team
            </p>
          </div>
        `,
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  if (failed > 0) {
    console.error(`${failed} of ${entries.length} waitlist emails failed`);
  }
}
