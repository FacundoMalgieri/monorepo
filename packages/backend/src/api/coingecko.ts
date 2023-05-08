import axios from 'axios';

export type ETHRate = {
  usd: number;
  eur: number;
};

export const getETHRate = async (): Promise<ETHRate> => {
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur';
  const response = await axios.get(url);
  return response.data.ethereum;
};
