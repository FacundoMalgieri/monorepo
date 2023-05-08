import React, { ChangeEventHandler, FC, useMemo, useState } from "react";
import {
  MdBookmark,
  MdBookmarkBorder,
  MdCheck,
  MdClose,
  MdEditSquare,
} from "react-icons/md";

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
  const [isEdit, setIsEdit] = useState(false);
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

  const onSetEdit = () => setIsEdit(!isEdit);

  // const onRateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  // };

  const isUsd = useMemo(() => currency === "usd", [currency]);

  const currentBalanceInFiat = useMemo(
    () =>
      isUsd
        ? `$ ${(usd * eth).toLocaleString()}`
        : `€ ${(eur * eth).toLocaleString()}`,
    [currency]
  );

  const formattedRate = useMemo(
    () => (isUsd ? `$ ${usd.toLocaleString()}` : `€ ${eur.toLocaleString()}`),
    [currency]
  );

  const renderFavIcons = useMemo(
    () =>
      isFav ? (
        <MdBookmarkBorder
          onClick={onMarkAsFavorite}
          className={styles.favIcon}
        />
      ) : (
        <MdBookmark onClick={onMarkAsFavorite} className={styles.favIcon} />
      ),
    [isFav]
  );

  const renderEditMode = useMemo(
    () =>
      isEdit ? (
        <div className={styles.editContainer}>
          <div className={styles.iconsContainer}>
            <MdClose onClick={onSetEdit} />
            <MdCheck />
          </div>
          <input
            className={styles.rateInput}
            type="text"
            value={isUsd ? usd : eur}
          />
        </div>
      ) : (
        <div className={styles.rateContainer}>
          <MdEditSquare onClick={onSetEdit} className={styles.editIcon} />
          <p>
            <b>Rate:</b> {formattedRate}
          </p>
        </div>
      ),
    [isEdit]
  );

  return (
    <div className={styles.container}>
      {old && <div className={styles.toast}>Wallet is old</div>}
      <div className={styles.address}>
        <p>{address}</p>
        {renderFavIcons}
      </div>
      <div className={styles.boxes}>
        <div className={styles.box}>
          <b>{eth.toLocaleString("en-US")} ETH</b>
          {renderEditMode}
        </div>
        <div className={styles.box}>
          <Select selected={currency} onChange={onSelectCurrency} />
          <p className={styles.currency}>{currentBalanceInFiat}</p>
        </div>
      </div>
      {separator && <Separator />}
    </div>
  );
};

export default Wallet;
