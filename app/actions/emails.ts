"use server";

import { resend } from "@/lib/email";
import AdminOrderNotification from "@/emails/admin-order-notification";
import KasheringConfirmation from "@/emails/kashering-confirmation";
import LettuceConfirmation from "@/emails/lettuce-confirmation";
import OrderStatusUpdate from "@/emails/order-status-update";
import TicketsConfirmation from "@/emails/tickets-confirmation";
import type { Address } from "@/lib/database.types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@yomorlando.com";

const FROM_EMAIL = "YoM Orlando <noreply@yomorlando.com>";

export async function sendAdminOrderNotification(data: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderType: string;
  total: number;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New ${data.orderType} order from ${data.customerName}`,
    react: AdminOrderNotification({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      orderType: data.orderType,
      total: data.total,
    }),
  });
}

export async function sendOrderStatusUpdate(data: {
  to: string;
  customerName: string;
  orderId: string;
  orderType: string;
  newStatus: string;
  total: number;
}) {
  const statusLabels: Record<string, string> = {
    pending: "Pending",
    fulfilled: "Fulfilled",
    shipped: "Shipped",
    picked_up: "Picked Up",
  };

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.to,
    subject: `YoM Orlando — Your order has been ${statusLabels[data.newStatus] || data.newStatus}`,
    react: OrderStatusUpdate({
      customerName: data.customerName,
      orderId: data.orderId,
      orderType: data.orderType,
      newStatus: data.newStatus,
      total: data.total,
    }),
  });
}

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
