import React, { FC, useEffect } from "react";

import "styles/base.scss";
import "nprogress/nprogress.css";
import useWallet from "./hooks/useWallet";
import SortRadioButtons from "./components/SortRadioButtons";
import Separator from "./components/Separator";
import WalletList from "./components/WalletList";
import AddWallet from "./components/AddWallet";
import styles from "./App.module.scss";

export type SortType = "FAV" | "ASC" | "DSC";

const App: FC = () => {
  const { data, sortBy, setSortBy, getAllWallets, createWallet, updateWallet } =
    useWallet();

  useEffect(() => {
    getAllWallets();
  }, [getAllWallets]);

  return (
    <div className={styles.appContainer}>
      <AddWallet createWallet={createWallet} />
      <SortRadioButtons onSortChange={setSortBy} sortBy={sortBy} />
      <Separator />
      <h2>Wallets List</h2>
      <WalletList wallets={data} updateWallet={updateWallet} />
    </div>
  );
};

export default App;
