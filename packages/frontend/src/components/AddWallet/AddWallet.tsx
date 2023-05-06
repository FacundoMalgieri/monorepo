import React, { FC, useState } from "react";

import styles from "./AddWallet.module.scss";

const ethRegex = "^[a-zA-Z0-9]{0,42}$";

type AddWalletProps = {
  createWallet: (address: string) => Promise<void>;
};

const AddWallet: FC<AddWalletProps> = ({ createWallet }) => {
  const [address, setAddress] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setAddress(inputValue);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createWallet(address);
    }
  };

  return (
    <input
      type="text"
      className={styles.address}
      placeholder={"Add your ETH wallet address"}
      value={address}
      pattern={ethRegex}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
    />
  );
};

export default AddWallet;
