import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Wallet from "./Wallet";

jest.mock("../../hooks/useRate", () => {
  return {
    __esModule: true,
    default: () => {
      return {
        isLoading: false,
        error: null,
        updateRate: jest.fn().mockResolvedValue({
          id: 1,
          eur: 0,
          usd: 7000,
          address: "0x1234567890123456789012345678901234567890",
        }),
      };
    },
  };
});

describe("Wallet", () => {
  const wallet = {
    id: 1,
    address: "0x1234567890123456789012345678901234567890",
    eth: 10,
    favorite: false,
    old: false,
    usd: 5000,
    eur: 4000,
  };
  const mockUpdateWallet = jest.fn();
  const mockDeleteWallet = jest.fn();
  const props = {
    wallet,
    updateWallet: mockUpdateWallet,
    deleteWallet: mockDeleteWallet,
  };

  beforeEach(() => {
    mockUpdateWallet.mockClear();
    mockDeleteWallet.mockClear();
    localStorage.clear();
  });

  it("should render the component with the wallet details", async () => {
    render(<Wallet {...props} />);

    expect(screen.getByText(wallet.address)).toBeInTheDocument();
    expect(screen.getByTestId("current-eth-balance")).toBeInTheDocument();
    expect(screen.getByText("$ 5,000")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("should toggle the favorite status when clicking on the favorite icon", async () => {
    render(<Wallet {...props} />);

    fireEvent.click(screen.getAllByTestId("favorite-icon-false")[0]);

    expect(mockUpdateWallet).toHaveBeenCalledTimes(1);
    expect(mockUpdateWallet).toHaveBeenCalledWith(1, { favorite: true });
  });

  it("should edit the rate when clicking on the edit icon and save the new rate", async () => {
    render(<Wallet {...props} />);

    fireEvent.click(screen.getByTestId("edit-icon"));
    const rateInput = screen.getByTestId("rate-input");
    expect(rateInput).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();

    fireEvent.change(rateInput, {
      target: { value: "7000" },
    });
    fireEvent.keyDown(rateInput, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("$ 7,000")).toBeInTheDocument();
      expect(screen.getByText("$ 70,000")).toBeInTheDocument();
      expect(screen.getByText("USD")).toBeInTheDocument();
    });
  });
});
