import React, { FC, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import "styles/base.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";

import useWallet from "./hooks/useWallet";
import RadioButtons from "./components/RadioButtons";
import Separator from "./components/Separator";
import WalletList from "./components/WalletList";
import AddWallet from "./components/AddWallet";
import styles from "./App.module.scss";

export type SortType = "FAV" | "ASC" | "DSC";

const App: FC = () => {
  const {
    data,
    sortBy,
    onSetSortBy,
    getAllWallets,
    createWallet,
    updateWallet,
  } = useWallet();

  useEffect(() => {
    getAllWallets();
  }, [sortBy]);

  return (
    <div className={styles.appContainer}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AddWallet createWallet={createWallet} />
      <RadioButtons onSortChange={onSetSortBy} sortBy={sortBy} />
      <Separator />
      <WalletList wallets={data} updateWallet={updateWallet} />
    </div>
  );
};

export default App;
