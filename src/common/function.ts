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
import { base32, bech32m } from "@scure/base";
import { PreviewResult, Result, Status, AddressType } from "../models";

function selectNetwork(networkId: number) {
  return networkId === NetworkId.Mainnet
    ? NETWORK_API.MAINNET_API
    : NETWORK_API.STOKENET_API;
}

async function formatConvert(str: string, networkId: number) {
  if (str.includes("_")) {
    // Address To Hex
    const chatArr: string[] = [];

    (await RadixEngineToolkit.Address.decode(str)).data.forEach((v) => {
      chatArr.push(v.toString(16).padStart(2, "0"));
    });

    return chatArr.join("");
  } else {
    // Hex To Address
    const fromHexString = (hex: string) => {
      const r = hex.match(/.{1,2}/g);
      //@ts-ignore
      return Uint8Array.from(r.map((byte) => parseInt(byte, 16)));
    };

    const uint8Arr = fromHexString(str) as Uint8Array;

    const numArr: number[] = [];

    const base32_str = base32.encode(uint8Arr).toLowerCase();

    for (let i = 0; i < base32_str.length; i++) {
      const code = base32_str.charCodeAt(i);

      if (code >= 97 && code <= 122) {
        numArr.push(code - 97);
      } else if (code >= 50 && code <= 55) {
        numArr.push(code - 24);
      }
    }

    const MAINNET_FIX = "_rdx";
    const STOKENET_FIX = "_tdx_2_";

    const NETWORK_FIX = networkId - 1 ? STOKENET_FIX : MAINNET_FIX;

    if (uint8Arr && uint8Arr.length === 30) {
      let prefix = "";

      switch (uint8Arr[0]) {
        case AddressType.GlobalAccessController:
          prefix = `accesscontroller${NETWORK_FIX}`;
          break;
        case AddressType.GlobalConsensusManager:
          prefix = `consensusmanager${NETWORK_FIX}`;
          break;
        case AddressType.GlobalTransactionTracker:
          prefix = `transactiontracker${NETWORK_FIX}`;
          break;
        case AddressType.InternalGenericComponent:
          prefix = `internal_component${NETWORK_FIX}`;
          break;
        case AddressType.InternalKeyValueStore:
          prefix = `internal_keyvaluestore${NETWORK_FIX}`;
          break;
        case AddressType.GlobalPackage:
          prefix = `package${NETWORK_FIX}`;
          break;
        case AddressType.GlobalGenericComponent:
          prefix = `component${NETWORK_FIX}`;
          break;
        case AddressType.GlobalValidator:
          prefix = `validator${NETWORK_FIX}`;
          break;
        case AddressType.GlobalOneResourcePool:
        case AddressType.GlobalTwoResourcePool:
        case AddressType.GlobalMultiResourcePool:
          prefix = `pool${NETWORK_FIX}`;
          break;
        case AddressType.GlobalAccount:
        case AddressType.GlobalVirtualEd25519Account:
        case AddressType.GlobalVirtualSecp256k1Account:
          prefix = `account${NETWORK_FIX}`;
          break;
        case AddressType.GlobalIdentity:
        case AddressType.GlobalVirtualEd25519Identity:
        case AddressType.GlobalVirtualSecp256k1Identity:
          prefix = `identity${NETWORK_FIX}`;
          break;
        case AddressType.GlobalFungibleResourceManager:
        case AddressType.GlobalNonFungibleResourceManager:
          prefix = `resource${NETWORK_FIX}`;
          break;
        case AddressType.InternalFungibleVault:
        case AddressType.InternalNonFungibleVault:
          prefix = `internal_vault${NETWORK_FIX}`;
          break;
      }

      if (prefix.length) {
        return bech32m.encode(prefix, numArr);
      } else {
        throw new Error("error format");
      }
    } else {
      throw new Error("error format");
    }
  }
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

  const stateUpdates: {
    created_substates: [];
    deleted_partitions: [];
    deleted_substates: [];
    new_global_entities: [];
    updated_substates: [];
    //@ts-ignore
  } = preview.receipt.state_updates;

  const stateAmount =
    stateUpdates.created_substates.length +
    stateUpdates.deleted_partitions.length +
    stateUpdates.deleted_substates.length +
    stateUpdates.new_global_entities.length +
    stateUpdates.updated_substates.length;

  const signerAmount = signerPublicKeys.length + 1;

  let fee = new Decimal(feeSummary.xrd_total_execution_cost)
    .plus(feeSummary.xrd_total_storage_cost)
    .plus(feeSummary.xrd_total_tipping_cost)
    .plus(feeSummary.xrd_total_royalty_cost)
    .plus(feeSummary.xrd_total_finalization_cost)
    .plus(new Decimal("0.00000005").mul("7000").mul(signerAmount))
    .plus(
      new Decimal("0.00009536743").mul("70").mul(stateAmount + signerAmount),
    );

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
  formatConvert,
  getCurrentEpoch,
  convertManifestTo,
  previewTransaction,
  processTransaction,
  generateTransaction,
};
