// Default settings values — safe to import from both client and server code.
// These serve as fallbacks when the database is unavailable.

export const DEFAULT_SETTINGS = {
  kashering_pricing: {
    base_price: 47500,
    solara_discount: 7500,
    ring_set_price: 6000,
    counter_roll_price: 3500,
  },
  lettuce_pricing: {
    price_per_bag: 2500,
    delivery_fee: 3000,
  },
  surcharge_rate: {
    rate: 0.03,
  },
  how_heard_options: [
    "Community WhatsApp chats",
    "CHAVI CHASE",
    "SY Classifieds",
    "Yeshiva World News",
    "School Flyer Handouts",
    "MKY Status",
    "My Jewish Florida",
    "Between Carpools",
    "Mommy Deals",
    "Jewish Echo",
    "Word of Mouth",
    "Other",
  ],
  ticket_delivery_options: [
    { value: "whatsapp", label: "WhatsApp (Disney only, free)", fee: 0 },
    { value: "ship_3day", label: "Ship \u2014 3 day ($25)", fee: 2500 },
    { value: "ship_overnight", label: "Ship \u2014 Overnight ($35)", fee: 3500 },
    { value: "pickup", label: "Pickup", fee: 0 },
  ],
  kashering_developments: [
    "Solara",
    "Windsor Westside",
    "Windsor Island",
    "Solterra",
    "Encore",
    "Reunion",
    "Champions Gate",
    "Eden Gardens",
    "Villatel Village",
    "Other",
  ],
  lettuce_developments: [
    "Solara",
    "Solterra",
    "Villatel Village",
    "Champions Gate",
    "Reunion/Bears Den",
    "Encore",
    "Storey Lake",
    "Windsor Island",
    "Eden Gardens",
  ],
  donation_presets: [18, 36, 54, 100],
} as const;

export type SettingsKey = keyof typeof DEFAULT_SETTINGS;

export type KasheringPricing = {
  base_price: number;
  solara_discount: number;
  ring_set_price: number;
  counter_roll_price: number;
};

export type LettucePricing = {
  price_per_bag: number;
  delivery_fee: number;
};

export type SurchargeRate = {
  rate: number;
};

export type DeliveryOption = {
  value: string;
  label: string;
  fee: number;
};

export type SiteSettings = {
  kashering_pricing: KasheringPricing;
  lettuce_pricing: LettucePricing;
  surcharge_rate: SurchargeRate;
  how_heard_options: string[];
  ticket_delivery_options: DeliveryOption[];
  kashering_developments: string[];
  lettuce_developments: string[];
  donation_presets: number[];
};
