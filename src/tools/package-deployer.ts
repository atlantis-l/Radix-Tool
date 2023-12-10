import {
  TransactionHeader,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionManifest,
  generateRandomNonce,
  ManifestSborStringRepresentation,
} from "@radixdlt/radix-engine-toolkit";
import { hash } from "../common/hash";
import { Ownership, Wallet } from "../models";
import { previewTransaction, processTransaction } from "../common";

const DEFAULT_FEE_LOCK = "200";

class PackageDeployer {
  networkId: number;
  deployerWallet: Wallet;
  feePayerWallet: Wallet;
  feeLock: string;

  constructor(networkId: number, deployerWallet: Wallet) {
    this.networkId = networkId;
    this.deployerWallet = deployerWallet;
    this.feePayerWallet = deployerWallet;
    this.feeLock = DEFAULT_FEE_LOCK;
  }

  async deployWithOwner(
    wasm: Uint8Array,
    rpd: Uint8Array,
    ownership: Ownership,
    ownerResource: string | undefined,
    lock: boolean,
    message: string | undefined,
    currentEpoch: number,
  ) {
    return processTransaction(this.networkId, async () => {
      const wasmHex = Array.from(wasm)
        .map((uint8) => uint8.toString(16).padStart(2, "0"))
        .join("");

      const wasmHash = hash(wasmHex).toString("hex");

      const decodedRpd = await RadixEngineToolkit.ManifestSbor.decodeToString(
        rpd,
        this.networkId,
        ManifestSborStringRepresentation.ManifestString,
      );

      let publishStr: string | undefined;

      if (ownership === Ownership.AllowAll) {
        if (lock) {
          publishStr = `
            Enum<1u8>(
                Enum<0u8>()
            )
        `;
        } else {
          publishStr = `
            Enum<2u8>(
                Enum<0u8>()
            )
        `;
        }
      }

      if (ownership === Ownership.Resource) {
        if (lock) {
          publishStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        } else {
          publishStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        }
      }

      if (ownership === Ownership.NFT) {
        if (lock) {
          publishStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        } else {
          publishStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        }
      }

      if (ownership === Ownership.None) {
        publishStr = `
          Enum<0u8>()
      `;
      }

      let manifestStr = `
      CALL_METHOD
          Address("${this.feePayerWallet.address}")
          "lock_fee"
          Decimal("${this.feeLock}")
      ;

      PUBLISH_PACKAGE_ADVANCED
          ${publishStr}
          ${decodedRpd}
          Blob("${wasmHash}")
          Map<String, Tuple>()
          None
      ;
      `;

      const manifest: TransactionManifest = {
        instructions: {
          kind: "String",
          value: manifestStr,
        },
        blobs: [wasm],
      };

      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.deployerWallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifestStep = (await TransactionBuilder.new()).header(header);

      message !== undefined && manifestStep.plainTextMessage(message);

      return manifestStep
        .manifest(manifest)
        .sign(this.feePayerWallet.privateKey)
        .notarize(this.deployerWallet.privateKey);
    });
  }

  async deploy(
    wasm: Uint8Array,
    rpd: Uint8Array,
    message: string | undefined,
    currentEpoch: number,
  ) {
    return processTransaction(this.networkId, async () => {
      const wasmHex = Array.from(wasm)
        .map((uint8) => uint8.toString(16).padStart(2, "0"))
        .join("");

      const wasmHash = hash(wasmHex).toString("hex");

      const decodedRpd = await RadixEngineToolkit.ManifestSbor.decodeToString(
        rpd,
        this.networkId,
        ManifestSborStringRepresentation.ManifestString,
      );

      const manifestString = `
      CALL_METHOD
      Address("${this.feePayerWallet.address}")
      "lock_fee"
      Decimal("${this.feeLock}");

      PUBLISH_PACKAGE
      ${decodedRpd}
      Blob("${wasmHash}")
      Map<String, Tuple>();

      CALL_METHOD
      Address("${this.deployerWallet.address}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP");
      `;

      const manifest: TransactionManifest = {
        instructions: {
          kind: "String",
          value: manifestString,
        },
        blobs: [wasm],
      };

      const header: TransactionHeader = {
        networkId: this.networkId,
        startEpochInclusive: currentEpoch,
        endEpochExclusive: currentEpoch + 2,
        nonce: generateRandomNonce(),
        notaryPublicKey: this.deployerWallet.publicKey,
        notaryIsSignatory: true,
        tipPercentage: 0,
      };

      const manifestStep = (await TransactionBuilder.new()).header(header);

      message !== undefined && manifestStep.plainTextMessage(message);

      return manifestStep
        .manifest(manifest)
        .sign(this.feePayerWallet.privateKey)
        .notarize(this.deployerWallet.privateKey);
    });
  }

  async deployWithOwnerPreview(
    wasm: Uint8Array,
    rpd: Uint8Array,
    ownership: Ownership,
    ownerResource: string | undefined,
    lock: boolean,
    currentEpoch: number,
  ) {
    const wasmHex = Array.from(wasm)
      .map((uint8) => uint8.toString(16).padStart(2, "0"))
      .join("");

    const wasmHash = hash(wasmHex).toString("hex");

    const decodedRpd = await RadixEngineToolkit.ManifestSbor.decodeToString(
      rpd,
      this.networkId,
      ManifestSborStringRepresentation.ManifestString,
    );

    let publishStr: string | undefined;

    if (ownership === Ownership.AllowAll) {
      if (lock) {
        publishStr = `
            Enum<1u8>(
                Enum<0u8>()
            )
        `;
      } else {
        publishStr = `
            Enum<2u8>(
                Enum<0u8>()
            )
        `;
      }
    }

    if (ownership === Ownership.Resource) {
      if (lock) {
        publishStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
      } else {
        publishStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
      }
    }

    if (ownership === Ownership.NFT) {
      if (lock) {
        publishStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
      } else {
        publishStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
      }
    }

    if (ownership === Ownership.None) {
      publishStr = `
          Enum<0u8>()
      `;
    }

    let manifestStr = `
    CALL_METHOD
        Address("${this.feePayerWallet.address}")
        "lock_fee"
        Decimal("${this.feeLock}")
    ;

    PUBLISH_PACKAGE_ADVANCED
        ${publishStr}
        ${decodedRpd}
        Blob("${wasmHash}")
        Map<String, Tuple>()
        None
    ;
    `;

    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestStr,
      },
      blobs: [],
    };

    return previewTransaction(
      this.networkId,
      manifest,
      this.deployerWallet.publicKey,
      [this.feePayerWallet.publicKey],
      [wasmHex],
      currentEpoch,
    );
  }

  async deployPreview(wasm: Uint8Array, rpd: Uint8Array, currentEpoch: number) {
    const wasmHex = Array.from(wasm)
      .map((uint8) => uint8.toString(16).padStart(2, "0"))
      .join("");

    const wasmHash = hash(wasmHex).toString("hex");

    const decodedRpd = await RadixEngineToolkit.ManifestSbor.decodeToString(
      rpd,
      this.networkId,
      ManifestSborStringRepresentation.ManifestString,
    );

    const manifestString = `
      CALL_METHOD
      Address("${this.feePayerWallet.address}")
      "lock_fee"
      Decimal("${this.feeLock}");

      PUBLISH_PACKAGE
      ${decodedRpd}
      Blob("${wasmHash}")
      Map<String, Tuple>();

      CALL_METHOD
      Address("${this.deployerWallet.address}")
      "deposit_batch"
      Expression("ENTIRE_WORKTOP");
      `;

    const manifest: TransactionManifest = {
      instructions: {
        kind: "String",
        value: manifestString,
      },
      blobs: [],
    };

    return previewTransaction(
      this.networkId,
      manifest,
      this.deployerWallet.publicKey,
      [this.feePayerWallet.publicKey],
      [wasmHex],
      currentEpoch,
    );
  }
}

export { PackageDeployer };
