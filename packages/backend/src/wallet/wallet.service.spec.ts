import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as etherscan from 'api/etherscan';
import { getETHBalance } from 'api/etherscan';
import { RateService } from 'rate/rate.service';

import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';

describe('WalletService', () => {
  let module: TestingModule;
  let walletService: WalletService;
  let rateService: RateService;
  let walletRepository: MockProxy<Repository<Wallet>>;

  const address1 = '0x1234567890123456789012345678901234567890';
  const address2 = '0x1234567890223456282014445648301231567272';

  const mockWallets: Wallet[] = [
    { id: 1, address: address1, eth: 1, favorite: true },
    { id: 2, address: address2, eth: 2, favorite: false },
  ];

  const mockBalanceResult = [
    {
      account: address1,
      balance: '1000000000000000000',
    },
    {
      account: address2,
      balance: '2000000000000000000',
    },
  ];

  const mockFindRates1 = {
    id: 1,
    usd: 100,
    eur: 80,
    address: address1,
  };

  const mockFindRates2 = {
    id: 2,
    usd: 100,
    eur: 80,
    address: address2,
  };

  const mockExtendedWallets = [
    {
      id: 1,
      address: address1,
      eth: 1,
      usd: 100,
      eur: 80,
      favorite: true,
      old: false,
    },
    {
      id: 2,
      address: address2,
      eth: 2,
      usd: 100,
      eur: 80,
      favorite: false,
      old: false,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    module = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useFactory: () => mockDeep(Repository),
        },
        { provide: RateService, useFactory: () => mock(RateService) },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    rateService = module.get<MockProxy<RateService>>(RateService);
    walletRepository = module.get<MockProxy<Repository<Wallet>>>(
      getRepositoryToken(Wallet),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  describe('extendWallets', () => {
    it('should extend wallets with rates and ETH balance', async () => {
      const getETHBalanceSpy = jest.spyOn(etherscan, 'getETHBalance');
      const getFirstTxTimestamp = jest.spyOn(etherscan, 'getFirstTxTimestamp');
      const findRateSpy = jest.spyOn(rateService, 'findRate');

      getETHBalanceSpy.mockResolvedValue(mockBalanceResult);
      getFirstTxTimestamp.mockResolvedValue(Date.now());
      findRateSpy.mockResolvedValue(mockFindRates1);
      findRateSpy.mockResolvedValue(mockFindRates2);

      const extendedWallets = await walletService.extendWallets(mockWallets);
      expect(extendedWallets).toEqual(mockExtendedWallets);
      expect(getETHBalance).toHaveBeenCalledWith(`${address1},${address2}`);
      expect(getFirstTxTimestamp).toHaveBeenCalledWith(address1);
      expect(getFirstTxTimestamp).toHaveBeenCalledWith(address2);
      expect(rateService.findRate).toHaveBeenCalledWith(address1);
      expect(rateService.findRate).toHaveBeenCalledWith(address2);
    });

    it('should handle empty wallets array', async () => {
      const extendedWallets = await walletService.extendWallets([]);
      expect(extendedWallets).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should return an array of ExtendedWallet objects', async () => {
      walletRepository.find.mockResolvedValue(mockWallets);
      jest
        .spyOn(walletService, 'extendWallets')
        .mockResolvedValue(mockExtendedWallets);
      const extendedWallets = await walletService.findAll('ASC');
      expect(extendedWallets).toEqual(mockExtendedWallets);
    });

    it('should return an empty array when no wallets are found', async () => {
      walletRepository.find.mockResolvedValue([]);
      const extendedWallets = await walletService.findAll('ASC');
      expect(extendedWallets).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a wallet', async () => {
      walletRepository.save.mockResolvedValue(mockWallets[0]);

      const result = await walletService.create({
        address: address1,
      } as Wallet);

      expect(result).toEqual(mockWallets[0]);
      expect(walletRepository.save).toHaveBeenCalledWith({ address: address1 });
    });

    it('should throw an error if the ETH address is invalid', async () => {
      const invalidWallet: Wallet = {
        ...mockWallets[0],
        address: 'invalidAddress',
      };

      await expect(walletService.create(invalidWallet)).rejects.toThrowError(
        'Invalid ETH address',
      );
    });
  });

  describe('update', () => {
    it('should update a wallet with a valid address', async () => {
      const updatedWallet: Wallet = {
        ...mockWallets[0],
        favorite: false,
      };

      walletRepository.update.mockResolvedValue(undefined);
      walletRepository.findOne.mockResolvedValue(updatedWallet);

      const result = await walletService.update(
        mockWallets[0].id,
        mockWallets[0],
      );

      expect(result).toEqual(updatedWallet);
      expect(walletRepository.update).toHaveBeenCalledWith(
        mockWallets[0].id,
        mockWallets[0],
      );
      expect(walletRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockWallets[0].id },
      });
    });
  });

  describe('delete', () => {
    it('should delete a wallet with a valid id', async () => {
      const walletId = 1;

      walletRepository.delete.mockResolvedValue(undefined);

      await expect(walletService.delete(walletId)).resolves.toBeUndefined();
      expect(walletRepository.delete).toHaveBeenCalledWith(walletId);
    });
  });
});
