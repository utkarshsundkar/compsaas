export interface PricingInfo {
  plan?: string;
  price?: string;
}

export interface GoldSubscription {
  price: string;
  features?: string[];
}

export interface Competitor {
  name: string;
  description: string;
  url?: string;
  pricing?: string | PricingInfo;
  linkedin?: string;
  twitter?: string;
  foundedDate: string;
  founders: string[];
  goldSubscription: GoldSubscription | null;
}