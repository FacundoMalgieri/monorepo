import { BalanceResponse } from 'api/etherscan';
import { SortType } from 'wallet/wallet.controller';
import { Wallet } from 'wallet/wallet.entity';

const ethRegex = /^(0x)?[0-9a-fA-F]{40}$/;

export const isValidETHAddress = (address: string): boolean =>
  ethRegex.test(address);

export const sanitizeAddresses = (wallets: Wallet[]): Wallet[] =>
  wallets
    .map((wallet) => {
      if (!isValidETHAddress(wallet.address)) {
        return undefined;
      }
      return wallet;
    })
    .filter(Boolean);

export const findAndWeiToEth = (accounts: BalanceResponse[], address) =>
  accounts.length
    ? Number(accounts?.find((eth) => eth.account === address).balance) /
      10 ** 18
    : 0;

export const sortBy = (sort: string): Record<string, SortType> => {
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
