import { useState } from "react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import NProgress from "nprogress";
import { toast } from "react-toastify";

import axios from "lib/axios";

interface UseHttpRequestReturn<T> {
  sendRequest: (requestConfig: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  isLoading: boolean;
  error?: string;
}

const useApi = <T>(): UseHttpRequestReturn<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const notify = (text: string) =>
    toast.error(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const sendRequest = async (
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    try {
      setIsLoading(true);
      NProgress.start();

      const response: AxiosResponse<T> = await axios(requestConfig);

      setIsLoading(false);
      NProgress.done();

      return response;
    } catch (error) {
      const err = error as AxiosError;
      err?.response?.status === 500
        ? notify("Max limit reached, please wait 2 seconds and try again")
        : notify(err.message);
      setIsLoading(false);
      setError(err.message);
      throw err.message || "An error occurred";
    } finally {
      NProgress.done();
    }
  };

  return { sendRequest, isLoading, error };
};

export default useApi;
