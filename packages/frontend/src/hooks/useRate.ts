import { RateEntity } from "lib/constants/types.constants";
import HTTP from "lib/constants/http.enum";
import { urlHelper } from "lib/helpers";
import { RATE_URL } from "lib/constants/routes.constants";

import useApi from "./useApi";

interface UseRateReturn {
  error?: string;
  isLoading: boolean;
  getRate: () => Promise<RateEntity>;
  updateRate: (id: number, wallet: Partial<RateEntity>) => Promise<RateEntity>;
}

const useRate = (): UseRateReturn => {
  const { sendRequest, isLoading, error } = useApi<RateEntity>();

  const getRate = async (): Promise<RateEntity> => {
    const response = await sendRequest({
      url: RATE_URL,
      method: HTTP.GET,
    });
    return response.data;
  };

  const updateRate = async (
    id: number,
    wallet: Partial<RateEntity>
  ): Promise<RateEntity> => {
    const res = await sendRequest({
      url: urlHelper(RATE_URL, id),
      method: HTTP.PUT,
      data: { ...wallet },
    });
    return res.data as RateEntity;
  };

  return {
    isLoading,
    error,
    getRate,
    updateRate,
  };
};

export default useRate;
