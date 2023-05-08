import React, { FC, useState } from "react";
import classNames from "classnames";
import { MdSearch } from "react-icons/md";

import { isValidETHAddress } from "lib/helpers";

import styles from "./AddWallet.module.scss";

type AddWalletProps = {
  createWallet: (address: string) => Promise<void>;
};

const AddWallet: FC<AddWalletProps> = ({ createWallet }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setAddress(inputValue);
  };

  const onCreateWallet = async () => {
    if (isValidETHAddress(address)) {
      await createWallet(address);
      setAddress("");
      setError("");
    } else {
      setError("Not a valid ETH address");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onCreateWallet();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <input
          type="text"
          className={classNames(styles.address, {
            [styles.errorInput]: error.length,
          })}
          placeholder={"Add your ETH wallet address"}
          value={address}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
        <MdSearch className={styles.searchIcon} onClick={onCreateWallet} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default AddWallet;
