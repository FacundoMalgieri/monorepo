import { useState, useEffect } from "react";
import { AxiosRequestConfig, AxiosResponse, AxiosError, Method } from "axios";

import axios from "lib/axios";

interface UseHttpRequestProps<T> {
  url: string;
  method: Method;
  headers?: AxiosRequestConfig["headers"];
  body?: AxiosRequestConfig["data"];
  initialData?: T;
}

interface UseHttpRequestReturn<T> {
  data?: T;
  error?: string;
  isLoading: boolean;
  sendRequest: (data?: AxiosRequestConfig["data"]) => Promise<void>;
}

const useApi = <T>({
  url,
  method,
  headers,
  body,
  initialData,
}: UseHttpRequestProps<T>): UseHttpRequestReturn<T> => {
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendRequest = async (requestData?: AxiosRequestConfig["data"]) => {
    try {
      setIsLoading(true);

      const response: AxiosResponse<T> = await axios({
        url,
        method,
        headers,
        data: requestData || body,
      });

      setData(response.data);
      setError(undefined);
    } catch (error) {
      setError((error as AxiosError<T>).message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading, sendRequest };
};

export default useApi;
