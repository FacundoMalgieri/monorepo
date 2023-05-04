import React, { FC } from "react";

import Separator from "components/Separator";

import styles from "./Wallet.module.scss";
import { WalletProps } from "./Wallet.constants";

const Wallet: FC<WalletProps> = ({
  wallet: { address, balance, favorite, old },
  separator = false,
}) => {
  return (
    <div className={styles.container}>
      {old && <div className={styles.toast}>Wallet is old</div>}
      <div className={styles.address}>
        <p>{address}</p>
        {favorite && <p>favorite</p>}
      </div>
      <div className={styles.boxes}>
        <div className={styles.box}>{balance}</div>
        <div className={styles.box}>abcasdadasdasdas</div>
      </div>
      {separator && <Separator />}
    </div>
  );
};

export default Wallet;
