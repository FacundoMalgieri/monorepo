import React, { FC } from "react";

import Wallet from "components/Wallet";
import { WalletEntity } from "lib/constants/types.constants";

import styles from "./WalletList.module.scss";

type WalletListProps = {
  updateWallet: (
    id: number,
    wallet: Partial<WalletEntity>
  ) => Promise<WalletEntity>;
  deleteWallet: (id: number) => Promise<void>;
  wallets: WalletEntity[] | undefined;
};

const WalletList: FC<WalletListProps> = ({
  wallets,
  updateWallet,
  deleteWallet,
}) => (
  <div className={styles.container}>
    {wallets?.map((wallet, index) => (
      <Wallet
        wallet={wallet}
        key={wallet.id}
        deleteWallet={deleteWallet}
        updateWallet={updateWallet}
        separator={index < wallets.length - 1}
      />
    ))}
  </div>
);

export default WalletList;
