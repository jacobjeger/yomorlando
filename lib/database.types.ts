export type HolidayType = "pesach" | "succos" | "winter_break";
export type ParkName = "universal" | "seaworld" | "disney" | "other";
export type OrderType = "tickets" | "kashering" | "lettuce";
export type FulfillmentStatus = "pending" | "fulfilled" | "shipped" | "picked_up";
export type AgeCategory = "child" | "adult";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface Event {
  id: string;
  name: string;
  holiday_type: HolidayType;
  year: number;
  start_date: string;
  end_date: string;
  order_open: string;
  order_close: string;
  is_published: boolean;
  created_at: string;
}

export interface Park {
  id: string;
  event_id: string;
  park_name: ParkName;
  is_active: boolean;
  display_order: number;
}

export interface TicketOption {
  id: string;
  park_id: string;
  option_code: string;
  label: string;
  description: string;
  price_child: number;
  price_adult: number;
  includes_epic: boolean;
  date_restriction_start: string | null;
  date_restriction_end: string | null;
  child_age_min: number;
  child_age_max: number | null;
  adult_age_min: number;
  is_active: boolean;
  display_order: number;
}

export interface EventDateRange {
  id: string;
  park_id: string;
  label: string;
  range_start: string;
  range_end: string;
}

export interface PickupLocation {
  id: string;
  event_id: string;
  name: string;
  address: string;
  notes: string;
}

export interface Order {
  id: string;
  event_id: string;
  order_type: OrderType;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: Address;
  stripe_payment_intent_id: string | null;
  subtotal: number;
  surcharge: number;
  donation: number;
  total: number;
  fulfillment_status: FulfillmentStatus;
  how_heard: string | null;
  comments: string | null;
  promo_code_id: string | null;
  discount: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_option_id: string | null;
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  age_category: AgeCategory | null;
  visit_date: string | null;
  delivery_method: string | null;
}

export interface KasheringDetails {
  id: string;
  order_id: string;
  villa_address: Address;
  development: string;
  access_day: string;
  num_bedrooms: number;
  num_houses: number;
  shul_membership: boolean;
}

export interface LettuceInventory {
  id: string;
  event_id: string;
  max_bags: number;
  is_waitlist_active: boolean;
}

export interface LettuceWaitlist {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  bags_requested: number;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type DiscountType = "percentage" | "fixed";
export type PromoAppliesTo = "all" | "tickets" | "kashering" | "lettuce";

export interface PromoCode {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  applies_to: PromoAppliesTo;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  note: string;
  created_at: string;
}

// Extended types with relations
export interface ParkWithOptions extends Park {
  ticket_options: TicketOption[];
  event_date_ranges: EventDateRange[];
}

export interface EventWithParks extends Event {
  parks: ParkWithOptions[];
  pickup_locations: PickupLocation[];
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
  kashering_details?: KasheringDetails;
}

// Supabase Database type for client
export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at">;
        Update: Partial<Omit<Event, "id" | "created_at">>;
      };
      parks: {
        Row: Park;
        Insert: Omit<Park, "id">;
        Update: Partial<Omit<Park, "id">>;
      };
      ticket_options: {
        Row: TicketOption;
        Insert: Omit<TicketOption, "id">;
        Update: Partial<Omit<TicketOption, "id">>;
      };
      event_date_ranges: {
        Row: EventDateRange;
        Insert: Omit<EventDateRange, "id">;
        Update: Partial<Omit<EventDateRange, "id">>;
      };
      pickup_locations: {
        Row: PickupLocation;
        Insert: Omit<PickupLocation, "id">;
        Update: Partial<Omit<PickupLocation, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      kashering_details: {
        Row: KasheringDetails;
        Insert: Omit<KasheringDetails, "id">;
        Update: Partial<Omit<KasheringDetails, "id">>;
      };
      lettuce_inventory: {
        Row: LettuceInventory;
        Insert: Omit<LettuceInventory, "id">;
        Update: Partial<Omit<LettuceInventory, "id">>;
      };
      lettuce_waitlist: {
        Row: LettuceWaitlist;
        Insert: Omit<LettuceWaitlist, "id" | "created_at">;
        Update: Partial<Omit<LettuceWaitlist, "id" | "created_at">>;
      };
      site_settings: {
        Row: { key: string; value: unknown; updated_at: string };
        Insert: { key: string; value: unknown; updated_at?: string };
        Update: Partial<{ key: string; value: unknown; updated_at: string }>;
      };
      faq_items: {
        Row: FaqItem;
        Insert: Omit<FaqItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<FaqItem, "id" | "created_at">>;
      };
      promo_codes: {
        Row: PromoCode;
        Insert: Omit<PromoCode, "id" | "created_at" | "current_uses">;
        Update: Partial<Omit<PromoCode, "id" | "created_at">>;
      };
      order_notes: {
        Row: OrderNote;
        Insert: Omit<OrderNote, "id" | "created_at">;
        Update: Partial<Omit<OrderNote, "id" | "created_at">>;
      };
    };
    Enums: {
      holiday_type: HolidayType;
      park_name: ParkName;
      order_type: OrderType;
      fulfillment_status: FulfillmentStatus;
      age_category: AgeCategory;
    };
  };
}
