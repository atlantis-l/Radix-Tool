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
  amount?: string;
  nonFungibleLocalIds?: string[];
}

export { TokenType, CustomOption };
