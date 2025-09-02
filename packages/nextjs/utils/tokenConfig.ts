// packages/nextjs/utils/tokenConfig.ts
import { Address } from "viem";

export type Token = {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
};

export const TOKENS: Token[] = [
  {
    name: "Ethena USDe",
    address: "0xf4BE938070f59764C85fAcE374F92A4670ff3877",
    symbol: "USDe",
    decimals: 18,
  },
  {
    name: "Token WETH",
    address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    symbol: "WETH",
    decimals: 18,
  },
  {
    name: "USDC",
    address: "0xe97A5e6C4670DD6fDeA0B5C3E304110eB0e599d9",
    symbol: "USDC",
    decimals: 6,
  },
];
