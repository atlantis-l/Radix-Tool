import { Wallet } from "./wallet";
import { Amount } from "@radixdlt/radix-engine-toolkit";

enum TokenType {
  FUNGIBLE,
  NONFUNGIBLE,
}

interface TransferInfo {
  tokenType: TokenType;
  tokenAddress: string;
  amount?: Amount;
  nonFungibleLocalIds?: string[];
}

interface CustomOption {
  fromWallet: Wallet;
  toAddress: string;
  transferInfos: TransferInfo[];
}

export { TokenType, CustomOption, TransferInfo };
