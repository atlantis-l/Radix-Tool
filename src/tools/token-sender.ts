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
import { CustomOption, Wallet, TokenType } from "../models";

const DEFAULT_FEE_LOCK = "10";

class TokenSender {
  networkId: number;
  mainWallet: Wallet;
  feePayer: Wallet;
  feeLock: string;

  constructor(networkId: number, mainWallet: Wallet) {
    this.networkId = networkId;
    this.mainWallet = mainWallet;
    this.feePayer = mainWallet;
    this.feeLock = DEFAULT_FEE_LOCK;
  }

  async sendFungible(
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
          tokenType: TokenType.FUNGIBLE,
          tokenAddress: tokenAddress,
          amount: amount,
        },
      ],
      message,
    );
  }

  async sendNonFungible(
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
          tokenType: TokenType.NONFUNGIBLE,
          tokenAddress: tokenAddress,
          nonFungibleLocalIds: nonFungibleLocalIds,
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
        this.feePayer.address,
        "lock_fee",
        [decimal(this.feeLock)],
      );

      customOptions.forEach((option) => {
        if (option.tokenType === TokenType.FUNGIBLE) {
          manifestBuilder.callMethod(option.fromWallet.address, "withdraw", [
            address(option.tokenAddress),
            //@ts-ignore
            decimal(option.amount),
          ]);
        } else if (option.tokenType === TokenType.NONFUNGIBLE) {
          const nonFungibleIdArray: Value = {
            kind: ValueKind.Array,
            elementValueKind: ValueKind.NonFungibleLocalId,
            //@ts-ignore
            elements: option.nonFungibleLocalIds.map((id) =>
              nonFungibleLocalId(id),
            ),
          };

          manifestBuilder.callMethod(
            option.fromWallet.address,
            "withdraw_non_fungibles",
            [address(option.tokenAddress), nonFungibleIdArray],
          );
        }

        manifestBuilder.callMethod(
          option.toAddress,
          "try_deposit_batch_or_abort",
          [expression(Expression.EntireWorktop), enumeration(0)],
        );
      });

      const manifest = manifestBuilder.build();

      return TransactionBuilder.new().then((builder) => {
        const manifestStep = builder.header(header);
        if (message !== undefined) {
          manifestStep.plainTextMessage(message);
        }

        const intentSignaturesStep = manifestStep.manifest(manifest);

        customOptions.forEach((option) => {
          if (option.fromWallet.address !== this.feePayer.address) {
            intentSignaturesStep.sign(option.fromWallet.privateKey);
          }
        });

        return intentSignaturesStep
          .sign(this.feePayer.privateKey)
          .notarize(this.mainWallet.privateKey);
      });
    });
  }
}

export { TokenSender };
