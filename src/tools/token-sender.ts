import {
  Amount,
  Expression,
  ManifestBuilder,
  TransactionBuilder,
  TransactionHeader,
  Value,
  ValueKind,
  address,
  decimal,
  enumeration,
  expression,
  generateRandomNonce,
  nonFungibleLocalId,
} from "@radixdlt/radix-engine-toolkit";
import { processTransaction } from "../common";
import { CustomOption, Wallet, TokenType, TransferInfo } from "../models";

const DEFAULT_FEE_LOCK = "10";

class TokenSender {
  networkId: number;
  mainWallet: Wallet;
  feePayerWallet: Wallet;
  feeLock: string;

  constructor(networkId: number, mainWallet: Wallet) {
    this.networkId = networkId;
    this.mainWallet = mainWallet;
    this.feePayerWallet = mainWallet;
    this.feeLock = DEFAULT_FEE_LOCK;
  }

  async sendFungibleToken(
    toAddress: string,
    tokenAddress: string,
    amount: Amount,
    message: string | undefined,
  ) {
    return this.sendCustom(
      [
        {
          fromWallet: this.mainWallet,
          toAddress: toAddress,
          transferInfos: [
            {
              tokenType: TokenType.FUNGIBLE,
              tokenAddress: tokenAddress,
              amount: amount,
            },
          ],
        },
      ],
      message,
    );
  }

  async sendNonFungibleToken(
    toAddress: string,
    tokenAddress: string,
    nonFungibleLocalIds: string[],
    message: string | undefined,
  ) {
    return this.sendCustom(
      [
        {
          fromWallet: this.mainWallet,
          toAddress: toAddress,
          transferInfos: [
            {
              tokenType: TokenType.NONFUNGIBLE,
              tokenAddress: tokenAddress,
              nonFungibleLocalIds: nonFungibleLocalIds,
            },
          ],
        },
      ],
      message,
    );
  }

  async sendTokens(
    toAddress: string,
    transferInfos: TransferInfo[],
    message: string | undefined,
  ) {
    return this.sendCustom(
      [
        {
          fromWallet: this.mainWallet,
          toAddress: toAddress,
          transferInfos: transferInfos,
        },
      ],
      message,
    );
  }

  async sendCustom(customOptions: CustomOption[], message: string | undefined) {
    return processTransaction(this.networkId, async (currentEpoch) => {
      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.mainWallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifestBuilder = new ManifestBuilder().callMethod(
        this.feePayerWallet.address,
        "lock_fee",
        [decimal(this.feeLock)],
      );

      const toAddressMap: Map<string, CustomOption[]> = new Map();

      customOptions.forEach((option) => {
        const options = toAddressMap.get(option.toAddress);

        if (options === undefined) {
          toAddressMap.set(option.toAddress, [option]);
        } else if (options !== undefined) {
          options.push(option);
        }
      });

      toAddressMap.forEach((options, toAddress) => {
        options.forEach((option) => {
          option.transferInfos.forEach((info) => {
            if (info.tokenType === TokenType.FUNGIBLE) {
              manifestBuilder.callMethod(
                option.fromWallet.address,
                "withdraw",
                [
                  address(info.tokenAddress),
                  //@ts-ignore
                  decimal(info.amount),
                ],
              );
            } else if (info.tokenType === TokenType.NONFUNGIBLE) {
              const nonFungibleIdArray: Value = {
                kind: ValueKind.Array,
                elementValueKind: ValueKind.NonFungibleLocalId,
                //@ts-ignore
                elements: info.nonFungibleLocalIds.map((id) =>
                  nonFungibleLocalId(id),
                ),
              };
              manifestBuilder.callMethod(
                option.fromWallet.address,
                "withdraw_non_fungibles",
                [address(info.tokenAddress), nonFungibleIdArray],
              );
            }
          });
        });

        manifestBuilder.callMethod(toAddress, "try_deposit_batch_or_abort", [
          expression(Expression.EntireWorktop),
          enumeration(0),
        ]);
      });

      const manifest = manifestBuilder.build();

      return TransactionBuilder.new().then((builder) => {
        const manifestStep = builder.header(header);

        message !== undefined && manifestStep.plainTextMessage(message);

        const intentSignaturesStep = manifestStep.manifest(manifest);

        const wallets = customOptions.map((option) => option.fromWallet);

        wallets.push(this.feePayerWallet);

        new Set(wallets).forEach((wallet) => {
          intentSignaturesStep.sign(wallet.privateKey);
        });

        return intentSignaturesStep.notarize(this.mainWallet.privateKey);
      });
    });
  }
}

export { TokenSender };
