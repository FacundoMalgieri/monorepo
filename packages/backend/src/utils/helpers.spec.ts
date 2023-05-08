import { Wallet } from 'wallet/wallet.entity';

import {
  findAndWeiToEth,
  isValidETHAddress,
  sanitizeAddresses,
  sortBy,
} from './helpers';

describe('Helper functions', () => {
  describe('isValidETHAddress', () => {
    it('should return true for a valid ETH address', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      expect(isValidETHAddress(validAddress)).toBe(true);
    });

    it('should return false for an invalid ETH address', () => {
      const invalidAddress = 'invalid-address';
      expect(isValidETHAddress(invalidAddress)).toBe(false);
    });
  });

  describe('sanitizeAddresses', () => {
    it('should filter out invalid ETH addresses', async () => {
      const invalidAddress = '0xinvalid';
      const validAddress = '0x1234567890123456789012345678901234567890';
      const wallets = [{ address: invalidAddress }, { address: validAddress }];
      const filteredWallets = sanitizeAddresses(wallets as Wallet[]);
      expect(filteredWallets).toHaveLength(1);
      expect(filteredWallets[0].address).toBe(validAddress);
    });
  });

  describe('findAndWeiToEth', () => {
    it('should filter out invalid ETH addresses', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const otherAddress = '0x1234577890123456789012355678901234567881';
      const balancesResponse = [
        {
          account: address,
          balance: '614582042891614958228',
        },
        {
          account: otherAddress,
          balance: '112382022394614958',
        },
      ];
      const result = findAndWeiToEth(balancesResponse, address);
      expect(result).toEqual(614.582042891615);
    });
  });

  describe('sortBy', () => {
    it('should return an object with id: ASC when sort is ASC', () => {
      const expected = { id: 'ASC' };
      const result = sortBy('ASC');
      expect(result).toEqual(expected);
    });

    it('should return an object with favorite: DESC when sort is FAV', () => {
      const expected = { favorite: 'DESC' };
      const result = sortBy('FAV');
      expect(result).toEqual(expected);
    });

    it('should return an object with id: DESC when sort is anything else', () => {
      const expected = { id: 'DESC' };
      // even though there's no actual check in the logic of the function I typed it to only receive DSC for consistency
      const result = sortBy('DSC');
      expect(result).toEqual(expected);
    });
  });
});
