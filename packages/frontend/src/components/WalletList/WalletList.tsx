import React from "react";

import Wallet from "components/Wallet";
import useWallet from "hooks/useWallet";

import styles from "./WalletList.module.scss";
import { wallets } from "./WalletList.constants";

const WalletList = () => {
  const { data, error, isLoading } = useWallet();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      {data?.map((wallet, index) => (
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
