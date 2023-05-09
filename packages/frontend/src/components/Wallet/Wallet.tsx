import React, {
  ChangeEventHandler,
  FC,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MdCheck, MdClose, MdEditSquare, MdRefresh } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoStarOutline, IoStarSharp } from "react-icons/io5";

import Separator from "components/Separator";
import { RateEntity, WalletEntity } from "lib/constants/types.constants";
import Select from "components/Select";
import useRate from "hooks/useRate";

import styles from "./Wallet.module.scss";

type WalletProps = {
  wallet: WalletEntity;
  separator?: boolean;
  updateWallet: (
    id: number,
    wallet: Partial<WalletEntity>
  ) => Promise<WalletEntity>;
  deleteWallet: (id: number) => Promise<void>;
};

const defaultCurrency = "defaultCurrency";

const Wallet: FC<WalletProps> = ({
  updateWallet,
  deleteWallet,
  wallet: { id, address, eth, favorite, old, usd, eur },
  separator = false,
}) => {
  const { updateRate } = useRate();
  const [isFav, setIsFav] = useState(favorite);
  const [isEdit, setIsEdit] = useState(false);
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem(defaultCurrency) || "usd"
  );
  const isUsd = useMemo(() => currency === "usd", [currency]);
  const [currentUsd, setCurrentUsd] = useState<number>(usd);
  const [currentEur, setCurrentEur] = useState<number>(eur);
  const [currentRate, setCurrentRate] = useState<number>(
    isUsd ? currentUsd : currentEur
  );
  const [newRate, setNewRate] = useState<string>(currentRate.toString());

  useEffect(() => {
    setCurrentRate(isUsd ? currentUsd : currentEur);
    setNewRate(String(isUsd ? currentUsd : currentEur));
  }, [isUsd, currency, currentUsd, currentEur]);

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

  const onSetEdit = (cancel?: boolean) => {
    if (isEdit && cancel) {
      // on cancel leave the currentRate value
      setNewRate(currentRate.toString());
    }

    setIsEdit(!isEdit);
  };

  /**
   * Gets the 3rd party current market rate
   * @param resetRate
   */
  const prepareUpdatePayload = (resetRate = false) => {
    let newRateNumber = 0; // in the server when 0 is sent, gets coingecko's rate
    const payload: Partial<RateEntity> = { address };

    if (!resetRate) {
      newRateNumber = Number(newRate);
    }

    if (isUsd) {
      payload.usd = newRateNumber;
    } else {
      payload.eur = newRateNumber;
    }

    return payload;
  };

  const onConfirmRateUpdate = async (resetRate = false) => {
    const payload = prepareUpdatePayload(resetRate);
    const res = await updateRate(payload);

    if (isUsd) {
      setCurrentUsd(res.usd);
    } else {
      setCurrentEur(res.eur);
    }
    onSetEdit();
  };

  const onChangeRate: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    const regex = /^(\d{0,10}(\.\d{0,2})?)$/;

    if (regex.test(value)) {
      setNewRate(value);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Enter") {
      onConfirmRateUpdate();
    }
    if (key === "Escape") {
      onSetEdit(true);
    }
  };

  const onDeleteWallet = () => {
    if (window.confirm("Are you sure?")) {
      deleteWallet(id);
    }
  };

  const currencySymbol = useMemo(() => (isUsd ? "$" : "€"), [currency]);

  const currentBalanceInFiat = useMemo(
    () => `${currencySymbol} ${(currentRate * eth).toLocaleString()}`,
    [currency, currentRate]
  );

  const formattedRate = useMemo(
    () => `${currencySymbol} ${currentRate.toLocaleString()}`,
    [currency, currentRate]
  );

  const renderFavIcons = useMemo(
    () =>
      isFav ? (
        <IoStarSharp
          onClick={onMarkAsFavorite}
          className={styles.favIcon}
          data-testid="favorite-icon-true"
        />
      ) : (
        <IoStarOutline
          onClick={onMarkAsFavorite}
          className={styles.favIcon}
          data-testid="favorite-icon-false"
        />
      ),
    [isFav]
  );

  const renderEditMode = useMemo(
    () =>
      isEdit ? (
        <div className={styles.editContainer}>
          <div className={styles.iconsContainer}>
            <MdClose
              className={styles.closeIcon}
              onClick={() => onSetEdit(true)}
            />
            <MdRefresh
              className={styles.refreshIcon}
              title="Get current market rate from Coingecko 3rd party"
              onClick={() => onConfirmRateUpdate(true)}
            />
            <MdCheck
              className={styles.checkIcon}
              onClick={() => onConfirmRateUpdate()}
            />
          </div>
          <input
            className={styles.rateInput}
            type="text"
            value={newRate}
            onChange={onChangeRate}
            onKeyDown={handleKeyPress}
            data-testid="rate-input"
          />
        </div>
      ) : (
        <div className={styles.rateContainer}>
          <MdEditSquare
            onClick={() => onSetEdit()}
            className={styles.editIcon}
            data-testid="edit-icon"
          />
          <p>
            <b>Rate:</b> {formattedRate}
          </p>
        </div>
      ),
    [isEdit, formattedRate, newRate]
  );

  return (
    <div className={styles.container}>
      <div className={styles.address}>
        <div className={styles.addressIconsContainer}>
          <RiDeleteBin6Line
            className={styles.deleteIcon}
            onClick={onDeleteWallet}
          />
          {renderFavIcons}
        </div>
        <div className={styles.addressContainer}>
          {old && (
            <AiOutlineClockCircle
              className={styles.oldWallet}
              title="Wallet is old"
            />
          )}
          {address}
          <div className={styles.addressIconsContainerInline}>
            <RiDeleteBin6Line
              className={styles.deleteIcon}
              onClick={onDeleteWallet}
            />
            {renderFavIcons}
          </div>
        </div>
      </div>
      <div className={styles.boxes}>
        <div className={styles.box} data-testid="current-eth-balance">
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
