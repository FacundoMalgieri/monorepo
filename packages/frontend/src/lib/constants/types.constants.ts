export interface WalletEntity {
  id: number;
  address: string;
  favorite: boolean;
  old: boolean;
  eth: number;
  eur: number;
  usd: number;
}

export type Currency = "usd" | "eur";

export interface RateEntity {
  id: number;
  eur: Currency;
  usd: Currency;
}
