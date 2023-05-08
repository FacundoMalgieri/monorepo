import axios from 'axios';

export type BalanceResponse = {
  account: string;
  balance: string;
};

export const getETHBalance = async (
  address: string,
): Promise<BalanceResponse[]> => {
  const url = `${process.env.ETH_SCAN_API_URL}?module=account&action=balancemulti&address=${address}&tag=latest    &apikey=${process.env.ETH_SCAN_API_KEY}`;
  const response = await axios.get(url);

  if (response.data.status === '0') {
    throw new Error('Something wrong with the addresses or Max limit reached');
  }

  return response.data.result;
};

export const getFirstTxTimestamp = async (address: string): Promise<number> => {
  const url = `${process.env.ETH_SCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${process.env.ETH_SCAN_API_KEY}`;

  const response = await axios.get(url);

  if (response.data.status === '0') {
    return 0;
  }

  return Number(response.data.result[0].timeStamp);
};
