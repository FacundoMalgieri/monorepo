import { useState } from "react";

import { WalletEntity } from "lib/constants/types.constants";
import HTTP from "lib/constants/http.enum";
import { successToast, urlHelper } from "lib/helpers";
import { WALLET_URL } from "lib/constants/routes.constants";
import { SortType } from "App";

import useApi from "./useApi";

interface UseWalletReturn {
  data?: WalletEntity[];
  error?: string;
  isLoading: boolean;
  sortBy: SortType;
  onSetSortBy: (value: SortType) => void;
  getAllWallets: () => Promise<void>;
  createWallet: (address: string) => Promise<void>;
  updateWallet: (
    id: number,
    wallet: Partial<WalletEntity>
  ) => Promise<WalletEntity>;
  deleteWallet: (id: number) => Promise<void>;
}

const lsKey = "sortBy";

const useWallet = (): UseWalletReturn => {
  const { sendRequest, isLoading, error } = useApi<
    WalletEntity | WalletEntity[]
  >();
  const [data, setData] = useState<WalletEntity[] | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortType>(
    localStorage.getItem(lsKey) as SortType
  );

  const onSetSortBy = (value: SortType) => {
    setSortBy(value);
    localStorage.setItem(lsKey, value);
  };

  const getAllWallets = async () => {
    const response = await sendRequest({
      url: urlHelper(WALLET_URL, "all"),
      method: HTTP.GET,
      params: { sort: sortBy },
    });
    setData(response.data as WalletEntity[]);
    onSetSortBy(sortBy || "DSC");
  };

  const createWallet = async (address: string) => {
    await sendRequest({
      url: WALLET_URL,
      method: HTTP.POST,
      data: { address },
    });
    successToast("Wallet created successfully");
    getAllWallets();
  };

  const updateWallet = async (
    id: number,
    wallet: Partial<WalletEntity>
  ): Promise<WalletEntity> => {
    const res = await sendRequest({
      url: urlHelper(WALLET_URL, id),
      method: HTTP.PATCH,
      data: { ...wallet },
    });
    successToast("Wallet updated successfully");
    return res.data as WalletEntity;
  };

  const deleteWallet = async (id: number): Promise<void> => {
    successToast("Wallet deleted successfully");
    await sendRequest({
      url: urlHelper(WALLET_URL, id),
      method: HTTP.DELETE,
    });
    getAllWallets();
  };

  return {
    data,
    isLoading,
    error,
    getAllWallets,
    sortBy,
    onSetSortBy,
    createWallet,
    updateWallet,
    deleteWallet,
  };
};

export default useWallet;
