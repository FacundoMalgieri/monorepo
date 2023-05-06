import axios from 'axios';

export const getETHBalance = async (address: string): Promise<number> => {
  const url = `${process.env.ES_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETH_API_KEY}`;
  const response = await axios.get(url);
  // result comes in wei so I convert it to ETH
  return Number(response.data.result) / 10 ** 18;
};
//
// export const getLastTransactionDate = async (address: string): Promise<string> => {
//   const url = `${process.env.ES_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETH_API_KEY}`;
// }
