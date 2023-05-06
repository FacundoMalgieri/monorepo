import React, { FC, useState } from "react";
import { MdOutlineFavorite, MdFavoriteBorder } from "react-icons/md";

import Separator from "components/Separator";

import styles from "./Wallet.module.scss";
import { WalletEntity } from "./Wallet.constants";

type WalletProps = {
  wallet: WalletEntity;
  separator?: boolean;
  updateWallet: (
    id: number,
    wallet: Partial<WalletEntity>
  ) => Promise<WalletEntity>;
};

const Wallet: FC<WalletProps> = ({
  updateWallet,
  wallet: { id, address, balance, favorite, old },
  separator = false,
}) => {
  const [isFav, setIsFav] = useState(favorite);

  const onMarkAsFavorite = async () => {
    const res = await updateWallet(id, { favorite: !favorite });
    if (res) {
      setIsFav(!isFav);
    }
  };

  return (
    <div className={styles.container}>
      {old && <div className={styles.toast}>Wallet is old</div>}
      <div className={styles.address}>
        <p>{address}</p>
        {isFav ? (
          <MdOutlineFavorite
            onClick={onMarkAsFavorite}
            className={styles.favIcon}
          />
        ) : (
          <MdFavoriteBorder
            onClick={onMarkAsFavorite}
            className={styles.favIcon}
          />
        )}
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
