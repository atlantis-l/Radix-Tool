import {
  ManifestSborStringRepresentation,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionHeader,
  TransactionManifest,
  generateRandomNonce,
} from "@radixdlt/radix-engine-toolkit";
import { Wallet } from "../models";
import { hash, processTransaction } from "../common";

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
    wasm: Buffer,
    rpd: Buffer,
    nonFungibleGlobalId: string,
    message: string | undefined,
  ) {
    return processTransaction(this.networkId, async (currentEpoch) => {
      const wasmHash = hash(wasm.toString("hex")).toString("hex");

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

      PUBLISH_PACKAGE_ADVANCED
      Enum<OwnerRole::Fixed>(
          Enum<AccessRule::Protected>(
              Enum<AccessRuleNode::ProofRule>(
                  Enum<ProofRule::Require>(
                      Enum<ResourceOrNonFungible::NonFungible>(
                          NonFungibleGlobalId("${nonFungibleGlobalId}")
                      )
                  )
              )
          )
      )
      ${decodedRpd}
      Blob("${wasmHash}")
      Map<String, Tuple>()
      None;
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

  async deploy(wasm: Buffer, rpd: Buffer, message: string | undefined) {
    return processTransaction(this.networkId, async (currentEpoch) => {
      const wasmHash = hash(wasm.toString("hex")).toString("hex");

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
}

export { PackageDeployer };
