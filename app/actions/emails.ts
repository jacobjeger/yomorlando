"use server";

import { resend } from "@/lib/email";
import KasheringConfirmation from "@/emails/kashering-confirmation";
import LettuceConfirmation from "@/emails/lettuce-confirmation";
import TicketsConfirmation from "@/emails/tickets-confirmation";
import type { Address } from "@/lib/database.types";

const FROM_EMAIL = "YoM Orlando <noreply@yomorlando.com>";

export async function sendKasheringConfirmation(data: {
  to: string;
  customerName: string;
  villaAddress: Address;
  development: string;
  accessDay: string;
  numHouses: number;
  numBedrooms: number;
  shulMembership: boolean;
  ringSetQty: number;
  counterRollQty: number;
  subtotal: number;
  surcharge: number;
  donation: number;
  total: number;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: "YoM Orlando — Kashering Order Confirmation",
    react: KasheringConfirmation({
      customerName: data.customerName,
      villaAddress: data.villaAddress,
      development: data.development,
      accessDay: data.accessDay,
      numHouses: data.numHouses,
      numBedrooms: data.numBedrooms,
      shulMembership: data.shulMembership,
      ringSetQty: data.ringSetQty,
      counterRollQty: data.counterRollQty,
      subtotal: data.subtotal,
      surcharge: data.surcharge,
      donation: data.donation,
      total: data.total,
    }),
  });
}

export async function sendLettuceConfirmation(data: {
  to: string;
  customerName: string;
  bags: number;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: string;
  development?: string;
  subtotal: number;
  surcharge: number;
  donation: number;
  total: number;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: "YoM Orlando — Checked Lettuce Order Confirmation",
    react: LettuceConfirmation({
      customerName: data.customerName,
      bags: data.bags,
      deliveryMethod: data.deliveryMethod,
      deliveryAddress: data.deliveryAddress,
      development: data.development,
      subtotal: data.subtotal,
      surcharge: data.surcharge,
      donation: data.donation,
      total: data.total,
    }),
  });
}

export async function sendTicketsConfirmation(data: {
  to: string;
  customerName: string;
  items: {
    parkName: string;
    optionLabel: string;
    ageCategory: string;
    quantity: number;
    unitPrice: number;
    visitDate?: string;
  }[];
  deliveryMethod: string;
  subtotal: number;
  shippingFee: number;
  surcharge: number;
  donation: number;
  total: number;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: "YoM Orlando — Park Tickets Order Confirmation",
    react: TicketsConfirmation({
      customerName: data.customerName,
      items: data.items,
      deliveryMethod: data.deliveryMethod,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      surcharge: data.surcharge,
      donation: data.donation,
      total: data.total,
    }),
  });
}
