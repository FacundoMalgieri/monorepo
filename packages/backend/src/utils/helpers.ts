import { BalanceResponse } from 'api/etherscan';
import { SortType } from 'wallet/wallet.controller';
import { Wallet } from 'wallet/wallet.entity';

const ethRegex = /^(0x)?[0-9a-fA-F]{40}$/;

export const isValidETHAddress = (address: string): boolean =>
  ethRegex.test(address);

export const sanitizeAddresses = (wallets: Wallet[]): Wallet[] =>
  wallets.filter((wallet) => isValidETHAddress(wallet.address));

export const findAndWeiToEth = (accounts: BalanceResponse[], address) =>
  accounts.length
    ? Number(accounts?.find((eth) => eth.account === address).balance) /
      10 ** 18
    : 0;

export const sortBy = (sort: SortType): Record<string, SortType> => {
  let orderBy;

  if (sort === 'ASC') {
    orderBy = { id: 'ASC' };
  } else if (sort === 'FAV') {
    orderBy = { favorite: 'DESC' };
  } else {
    orderBy = { id: 'DESC' };
  }

  return orderBy;
};

export const getWalletAddresses = (wallets: Wallet[]): string =>
  wallets.map((wallet) => wallet.address).join(',');

export const isOlderThanOneYear = (timestamp: number): boolean => {
  if (timestamp !== 0) {
    const oneYearAgo = new Date();
    const date = new Date(timestamp * 1000);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return date < oneYearAgo;
  }
  return false;
};
