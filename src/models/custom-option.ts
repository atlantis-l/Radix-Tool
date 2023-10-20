import { Amount } from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "./wallet";

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
