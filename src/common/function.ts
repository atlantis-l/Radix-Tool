import {
  NetworkId,
  PublicKey,
  RadixEngineToolkit,
  TransactionManifest,
  generateRandomNonce,
  NotarizedTransaction,
  CompiledNotarizedTransaction,
} from "@radixdlt/radix-engine-toolkit";
import {
  GatewayApiClient,
  PublicKeyEddsaEd25519KeyTypeEnum,
  TransactionPreviewOperationRequest,
} from "@radixdlt/babylon-gateway-api-sdk";
import Decimal from "decimal.js";
import { NETWORK_API } from "./gateway-api";
import { PreviewResult, Result, Status } from "../models";

function selectNetwork(networkId: number) {
  return networkId === NetworkId.Mainnet
    ? NETWORK_API.MAINNET_API
    : NETWORK_API.STOKENET_API;
}

async function getCurrentEpoch(networkId: number) {
  const currentStatus = await selectNetwork(networkId).status.getCurrent();
  return currentStatus.ledger_state.epoch;
}

async function generateTransaction(transaction: NotarizedTransaction) {
  const intentHash =
    await RadixEngineToolkit.NotarizedTransaction.intentHash(transaction);

  const compiled =
    await RadixEngineToolkit.NotarizedTransaction.compile(transaction);

  const notarizedTransactionHash =
    await RadixEngineToolkit.NotarizedTransaction.notarizedTransactionHash(
      transaction,
    );

  return new CompiledNotarizedTransaction(
    intentHash,
    compiled,
    notarizedTransactionHash,
  );
}

function submitTransaction(
  networkApi: GatewayApiClient,
  transaction: CompiledNotarizedTransaction,
) {
  return networkApi.transaction.innerClient.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: transaction.toHex(),
    },
  });
}

async function processTransaction(
  networkId: number,
  f: () => Promise<NotarizedTransaction>,
): Promise<Result> {
  try {
    const NETWORK_API = selectNetwork(networkId);

    const transaction = await generateTransaction(await f());

    const result = await submitTransaction(NETWORK_API, transaction);

    return result.duplicate
      ? {
          status: Status.DUPLICATE_TX,
          transactionId: transaction.intentHash.id,
        }
      : {
          status: Status.SUCCESS,
          transactionId: transaction.intentHash.id,
        };
  } catch (e) {
    console.error(e);
    return {
      status: Status.FAIL,
    };
  }
}

async function previewTransaction(
  networkId: number,
  manifest: TransactionManifest,
  notaryPublicKey: PublicKey,
  signerPublicKeys: PublicKey[],
  blobsHex: string[],
  currentEpoch: number,
) {
  const NETWORK_API = selectNetwork(networkId);

  manifest.instructions.kind === "Parsed" &&
    (await convertManifestTo("String", manifest, networkId));

  const request: TransactionPreviewOperationRequest = {
    transactionPreviewRequest: {
      tip_percentage: 0,
      blobs_hex: blobsHex,
      notary_is_signatory: true,
      nonce: generateRandomNonce(),
      start_epoch_inclusive: currentEpoch,
      end_epoch_exclusive: currentEpoch + 2,
      manifest: manifest.instructions.value as string,
      flags: {
        use_free_credit: true,
        skip_epoch_check: true,
        assume_all_signature_proofs: true,
      },
      notary_public_key: {
        key_hex: notaryPublicKey.hexString(),
        key_type: PublicKeyEddsaEd25519KeyTypeEnum.EddsaEd25519,
      },
      signer_public_keys: signerPublicKeys.map((publicKey) => {
        return {
          key_hex: publicKey.hexString(),
          key_type: PublicKeyEddsaEd25519KeyTypeEnum.EddsaEd25519,
        };
      }),
    },
  };

  const preview =
    await NETWORK_API.transaction.innerClient.transactionPreview(request);

  const feeSummary: {
    xrd_total_royalty_cost: string;
    xrd_total_storage_cost: string;
    xrd_total_tipping_cost: string;
    xrd_total_execution_cost: string;
    xrd_total_finalization_cost: string;
    //@ts-ignore
  } = preview.receipt.fee_summary;

  let fee = new Decimal(feeSummary.xrd_total_execution_cost)
    .plus(feeSummary.xrd_total_storage_cost)
    .plus(feeSummary.xrd_total_tipping_cost)
    .plus(feeSummary.xrd_total_royalty_cost)
    .plus(feeSummary.xrd_total_finalization_cost);

  return {
    fee: fee.toString(),
    //@ts-ignore
    status: preview.receipt.status,
    //@ts-ignore
    errorMessage: preview.receipt.error_message,
  } as PreviewResult;
}

async function convertManifestTo(
  kind: "String" | "Parsed",
  manifest: TransactionManifest,
  networkId: number,
) {
  manifest.instructions = await RadixEngineToolkit.Instructions.convert(
    manifest.instructions,
    networkId,
    kind,
  );
}

export {
  selectNetwork,
  getCurrentEpoch,
  convertManifestTo,
  previewTransaction,
  processTransaction,
  generateTransaction,
};
