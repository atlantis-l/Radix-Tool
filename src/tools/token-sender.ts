import {
  Value,
  Amount,
  address,
  decimal,
  PublicKey,
  ValueKind,
  Expression,
  expression,
  enumeration,
  ManifestBuilder,
  TransactionHeader,
  nonFungibleLocalId,
  TransactionBuilder,
  generateRandomNonce,
  PrivateKey,
} from "@radixdlt/radix-engine-toolkit";
import { previewTransaction, processTransaction } from "../common";
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

  sendFungibleToken(
    toAddress: string,
    tokenAddress: string,
    amount: Amount,
    signerPrivateKeys: PrivateKey[],
    message: string | undefined,
    currentEpoch: number,
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
      signerPrivateKeys,
      message,
      currentEpoch,
    );
  }

  sendNonFungibleToken(
    toAddress: string,
    tokenAddress: string,
    nonFungibleLocalIds: string[],
    signerPrivateKeys: PrivateKey[],
    message: string | undefined,
    currentEpoch: number,
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
      signerPrivateKeys,
      message,
      currentEpoch,
    );
  }

  sendTokens(
    toAddress: string,
    transferInfos: TransferInfo[],
    signerPrivateKeys: PrivateKey[],
    message: string | undefined,
    currentEpoch: number,
  ) {
    return this.sendCustom(
      [
        {
          fromWallet: this.mainWallet,
          toAddress: toAddress,
          transferInfos: transferInfos,
        },
      ],
      signerPrivateKeys,
      message,
      currentEpoch,
    );
  }

  sendCustom(
    customOptions: CustomOption[],
    signerPrivateKeys: PrivateKey[],
    message: string | undefined,
    currentEpoch: number,
  ) {
    return processTransaction(this.networkId, async () => {
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

      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.mainWallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifestStep = (await TransactionBuilder.new()).header(header);

      message !== undefined && manifestStep.plainTextMessage(message);

      const intentSignaturesStep = manifestStep.manifest(
        manifestBuilder.build(),
      );

      signerPrivateKeys.forEach((privateKey) => {
        intentSignaturesStep.sign(privateKey);
      });

      return intentSignaturesStep.notarize(this.mainWallet.privateKey);
    });
  }

  sendCustomPreview(
    customOptions: CustomOption[],
    signerPublicKeys: PublicKey[],
    currentEpoch: number,
  ) {
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
            manifestBuilder.callMethod(option.fromWallet.address, "withdraw", [
              address(info.tokenAddress),
              //@ts-ignore
              decimal(info.amount),
            ]);
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

    return previewTransaction(
      this.networkId,
      manifest,
      this.mainWallet.publicKey,
      signerPublicKeys,
      [],
      currentEpoch,
    );
  }
}

export { TokenSender };
