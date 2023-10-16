import {
  NetworkId,
  CompiledNotarizedTransaction,
  NotarizedTransaction,
  RadixEngineToolkit,
  generateRandomNonce,
  PublicKey,
  TransactionManifest,
} from "@radixdlt/radix-engine-toolkit";
import {
  GatewayApiClient,
  PublicKeyEddsaEd25519KeyTypeEnum,
  TransactionPreviewOperationRequest,
} from "@radixdlt/babylon-gateway-api-sdk";
import { DUPLICATE_RESULT, FAIL_RESULT, SUCCESS_RESULT } from "./common-result";
import { NETWORK_API } from "./gateway-api";
import Decimal from "decimal.js";

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

async function submitTransaction(
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
  f: (currentEpoch: number) => Promise<NotarizedTransaction>,
) {
  try {
    const NETWORK_API = selectNetwork(networkId);

    const transaction = await generateTransaction(
      await f(await getCurrentEpoch(networkId)),
    );

    const result = await submitTransaction(NETWORK_API, transaction);

    return result.duplicate ? DUPLICATE_RESULT : SUCCESS_RESULT;
  } catch (e) {
    console.error(e);
    return FAIL_RESULT;
  }
}

async function calculateFee(
  networkId: number,
  currentEpoch: number,
  manifest: TransactionManifest,
  publicKey: PublicKey,
) {
  const NETWORK_API = selectNetwork(networkId);

  await convertManifestTo("String", manifest, networkId);

  const request: TransactionPreviewOperationRequest = {
    transactionPreviewRequest: {
      //@ts-ignore
      manifest: manifest.instructions.value,
      start_epoch_inclusive: currentEpoch,
      end_epoch_exclusive: currentEpoch + 2,
      notary_public_key: {
        key_type: PublicKeyEddsaEd25519KeyTypeEnum.EddsaEd25519,
        key_hex: publicKey.hexString(),
      },
      notary_is_signatory: true,
      tip_percentage: 0,
      nonce: generateRandomNonce(),
      signer_public_keys: [
        {
          key_type: PublicKeyEddsaEd25519KeyTypeEnum.EddsaEd25519,
          key_hex: publicKey.hexString(),
        },
      ],
      flags: {
        use_free_credit: true,
        assume_all_signature_proofs: true,
        skip_epoch_check: true,
      },
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
  return fee.toString();
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
  generateTransaction,
  selectNetwork,
  processTransaction,
  calculateFee,
  convertManifestTo,
  getCurrentEpoch,
};
