export interface WalletEntity {
  id: number;
  address: string;
  favorite: boolean;
  old: boolean;
  balance: number;
}

export type WalletProps = {
  wallet: WalletEntity;
  separator?: boolean;
};
