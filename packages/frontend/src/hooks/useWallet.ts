import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { WalletEntity } from "components/Wallet/Wallet.constants";
import HTTP from "lib/constants/http.enum";
import { urlHelper } from "lib/helpers";
import { WALLETS_URL } from "lib/constants/routes.constants";
import { SortType } from "App";

import useApi from "./useApi";

interface UseWalletReturn {
  data?: WalletEntity[];
  error?: string;
  isLoading: boolean;
  sortBy: SortType;
  setSortBy: Dispatch<SetStateAction<SortType>>;
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

  const onSetSortBy = useCallback((value: SortType) => {
    setSortBy(value);
    localStorage.setItem(lsKey, value);
  }, []);

  const getAllWallets = useCallback(async () => {
    const response = await sendRequest({
      url: WALLETS_URL,
      method: HTTP.GET,
      params: { sort: sortBy },
    });
    setData(response.data as WalletEntity[]);
    onSetSortBy(sortBy || "DSC");
  }, [sendRequest, sortBy, onSetSortBy]);

  const createWallet = async (address: string) => {
    await sendRequest({
      url: WALLETS_URL,
      method: HTTP.POST,
      data: { address },
    });
    getAllWallets();
  };

  const updateWallet = async (
    id: number,
    wallet: Partial<WalletEntity>
  ): Promise<WalletEntity> => {
    const res = await sendRequest({
      url: urlHelper(WALLETS_URL, id),
      method: HTTP.PATCH,
      data: { ...wallet },
    });
    return res.data as WalletEntity;
  };

  const deleteWallet = async (id: number) => {
    await sendRequest({
      url: urlHelper(WALLETS_URL, id),
      method: HTTP.DELETE,
    });
  };

  return {
    data,
    isLoading,
    error,
    getAllWallets,
    sortBy,
    setSortBy,
    createWallet,
    updateWallet,
    deleteWallet,
  };
};

export default useWallet;
