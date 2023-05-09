import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

import { WalletController } from './wallet.controller';
import { ExtendedWallet, WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';

describe('WalletController', () => {
  let walletController: WalletController;
  let walletService: MockProxy<WalletService>;
  const address1 = '0x1234567890123456789012345678901234567890';
  const address2 = '0x1234567890223456282014445648301231567272';
  const mockWallets: Wallet[] = [
    { id: 1, address: address1, eth: 1, favorite: true },
    { id: 2, address: address2, eth: 2, favorite: false },
  ];
  const mockExtendedWallets: ExtendedWallet[] = [
    {
      id: 1,
      address: address1,
      eth: 1,
      favorite: true,
      old: true,
      usd: 100,
      eur: 80,
    },
    {
      id: 2,
      address: address2,
      eth: 2,
      favorite: false,
      old: true,
      usd: 100,
      eur: 80,
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        { provide: WalletService, useFactory: () => mock(WalletService) },
      ],
    }).compile();

    walletController = module.get<WalletController>(WalletController);
    walletService = module.get<MockProxy<WalletService>>(WalletService);
  });

  describe('findAll', () => {
    it('should call walletService.findAll with the provided sort parameter', async () => {
      const sort = 'FAV';
      await walletController.findAll(sort);
      expect(walletService.findAll).toHaveBeenCalledWith(sort);
    });

    it('should return an array of wallets', async () => {
      jest
        .spyOn(walletService, 'findAll')
        .mockResolvedValue(mockExtendedWallets);
      const result = await walletController.findAll('ASC');
      expect(result).toEqual(mockExtendedWallets);
    });
  });

  describe('create', () => {
    it('should call walletService.create with the provided wallet', async () => {
      await walletController.create({ address: address1 } as Wallet);
      expect(walletService.create).toHaveBeenCalledWith({ address: address1 });
    });

    it('should return the created wallet', async () => {
      jest.spyOn(walletService, 'create').mockResolvedValue(mockWallets[0]);
      const result = await walletController.create({
        address: address1,
      } as Wallet);
      expect(result).toEqual(mockWallets[0]);
    });
  });

  describe('update', () => {
    it('should update the specified wallet', async () => {
      const updatedWallet: Wallet = { ...mockWallets[0], favorite: false };
      jest.spyOn(walletService, 'update').mockResolvedValueOnce(updatedWallet);

      const result = await walletController.update(
        mockWallets[0].id,
        updatedWallet,
      );

      expect(result).toEqual(updatedWallet);
      expect(walletService.update).toHaveBeenCalledWith(
        mockWallets[0].id,
        updatedWallet,
      );
    });
  });

  describe('delete', () => {
    it('should delete the specified wallet', async () => {
      jest.spyOn(walletService, 'delete').mockResolvedValue(undefined);

      await walletController.delete(mockWallets[0].id);

      expect(walletService.delete).toHaveBeenCalledWith(mockWallets[0].id);
    });
  });
});
