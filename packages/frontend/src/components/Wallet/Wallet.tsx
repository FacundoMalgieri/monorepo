import React, { ChangeEventHandler, FC, useMemo, useState } from "react";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";

import Separator from "components/Separator";
import { WalletEntity } from "lib/constants/types.constants";
import Select from "components/Select";

import styles from "./Wallet.module.scss";

type WalletProps = {
  wallet: WalletEntity;
  separator?: boolean;
  updateWallet: (
    id: number,
    wallet: Partial<WalletEntity>
  ) => Promise<WalletEntity>;
};

const defaultCurrency = "defaultCurrency";

const Wallet: FC<WalletProps> = ({
  updateWallet,
  wallet: { id, address, eth, favorite, old, usd, eur },
  separator = false,
}) => {
  const [isFav, setIsFav] = useState(favorite);
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem(defaultCurrency) || "usd"
  );

  const onMarkAsFavorite = async () => {
    const res = await updateWallet(id, { favorite: !favorite });
    if (res) {
      setIsFav(!isFav);
    }
  };

  const onSelectCurrency: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { value } = event.target;
    setCurrency(value);
    localStorage.setItem(defaultCurrency, value);
  };

  const selectOptions = useMemo(
    () => [
      {
        label: "USD",
        value: "usd",
      },
      {
        label: "EUR",
        value: "eur",
      },
    ],
    []
  );

  const renderFavIcons = useMemo(
    () =>
      isFav ? (
        <MdOutlineFavorite
          onClick={onMarkAsFavorite}
          className={styles.favIcon}
        />
      ) : (
        <MdFavoriteBorder
          onClick={onMarkAsFavorite}
          className={styles.favIcon}
        />
      ),
    [isFav]
  );

  const currentBalanceInFiat = useMemo(
    () =>
      currency === "usd"
        ? `$ ${(usd * eth).toLocaleString()}`
        : `€ ${(eur * eth).toLocaleString()}`,
    [currency]
  );

  return (
    <div className={styles.container}>
      {old && <div className={styles.toast}>Wallet is old</div>}
      <div className={styles.address}>
        <p>{address}</p>
        {renderFavIcons}
      </div>
      <div className={styles.boxes}>
        <div className={styles.box}>{usd.toLocaleString("en-US")}</div>
        <div className={styles.box}>
          <p>{eth.toLocaleString("en-US")} ETH</p>
          <div className={styles.selectContainer}>
            <Select
              selected={currency}
              onChange={onSelectCurrency}
              elements={selectOptions}
            />
            <p className={styles.currency}>{currentBalanceInFiat}</p>
          </div>
        </div>
      </div>
      {separator && <Separator />}
    </div>
  );
};

export default Wallet;
