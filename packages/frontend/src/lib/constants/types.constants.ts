export interface WalletEntity {
  id: number;
  address: string;
  favorite: boolean;
  old: boolean;
  eth: number;
  eur: number;
  usd: number;
}

export interface RateEntity {
  id: number;
  eur: number;
  usd: number;
  address: string;
}
