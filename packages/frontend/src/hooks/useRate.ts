import { RateEntity } from "lib/constants/types.constants";
import HTTP from "lib/constants/http.enum";
import { RATE_URL } from "lib/constants/routes.constants";
import { successToast } from "lib/helpers";

import useApi from "./useApi";

interface UseRateReturn {
  error?: string;
  isLoading: boolean;
  updateRate: (rateData: Partial<RateEntity>) => Promise<RateEntity>;
}

const useRate = (): UseRateReturn => {
  const { sendRequest, isLoading, error } = useApi<RateEntity>();

  const updateRate = async (
    rateData: Partial<RateEntity>
  ): Promise<RateEntity> => {
    const res = await sendRequest({
      url: RATE_URL,
      method: HTTP.PATCH,
      data: { ...rateData },
    });
    successToast("Rate updated successfully");
    return res.data as RateEntity;
  };

  return {
    isLoading,
    error,
    updateRate,
  };
};

export default useRate;
