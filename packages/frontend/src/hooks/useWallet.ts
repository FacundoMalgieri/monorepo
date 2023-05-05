import { WalletEntity } from "components/Wallet/Wallet.constants";
import HTTP from "lib/constants/http.enum";
import { urlHelper } from "lib/helpers";
import { WALLETS_URL } from "lib/constants/routes.constants";

import useApi from "./useApi";

interface UseWalletReturn {
  data?: WalletEntity[];
  error?: string;
  isLoading: boolean;
  createWallet: (wallet: WalletEntity) => Promise<void>;
  updateWallet: (id: number, wallet: WalletEntity) => Promise<void>;
  deleteWallet: (id: number) => Promise<void>;
}

const useWallet = (): UseWalletReturn => {
  const { data, error, isLoading, sendRequest } = useApi<WalletEntity[]>({
    url: WALLETS_URL,
    method: HTTP.GET,
    initialData: [],
  });

  const createWallet = async (wallet: WalletEntity) => {
    await sendRequest({
      method: HTTP.POST,
      data: wallet,
    });
  };

  const updateWallet = async (id: number, wallet: WalletEntity) => {
    await sendRequest({
      url: urlHelper(WALLETS_URL, id),
      method: HTTP.PATCH,
      data: wallet,
    });
  };

  const deleteWallet = async (id: number) => {
    await sendRequest({
      url: urlHelper(WALLETS_URL, id),
      method: HTTP.DELETE,
    });
  };

  return {
    data,
    error,
    isLoading,
    createWallet,
    updateWallet,
    deleteWallet,
  };
};

export default useWallet;
