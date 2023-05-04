import React from "react";

import Wallet from "components/Wallet";

import styles from "./WalletList.module.scss";
import { wallets } from "./WalletList.constants";

const WalletList = () => {
  return (
    <div className={styles.container}>
      {wallets.map((wallet, index) => (
        <Wallet
          wallet={wallet}
          key={wallet.id}
          separator={index < wallets.length - 1}
        />
      ))}
    </div>
  );
};

export default WalletList;
