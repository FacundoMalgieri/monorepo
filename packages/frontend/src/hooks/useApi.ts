import { useCallback, useState } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import NProgress from "nprogress";

import axios from "lib/axios";

interface UseHttpRequestReturn<T> {
  sendRequest: (requestConfig: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  isLoading: boolean;
  error?: string;
}

const useApi = <T>(): UseHttpRequestReturn<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const sendRequest = useCallback(
    async (requestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      try {
        setIsLoading(true);
        NProgress.start();

        const response: AxiosResponse<T> = await axios(requestConfig);

        setIsLoading(false);
        NProgress.done();

        return response;
      } catch (error) {
        const err = error as AxiosError<T>;
        setIsLoading(false);
        setError(err.message);
        throw err.message || "An error occurred";
      } finally {
        NProgress.done();
      }
    },
    []
  );

  return { sendRequest, isLoading, error };
};

export default useApi;
