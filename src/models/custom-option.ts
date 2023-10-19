import { Amount } from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "./wallet";

enum TokenType {
  FUNGIBLE,
  NONFUNGIBLE,
}

interface CustomOption {
  fromWallet: Wallet;
  toAddress: string;
  tokenType: TokenType;
  tokenAddress: string;
  amount?: Amount;
  nonFungibleLocalIds?: string[];
}

export { TokenType, CustomOption };
