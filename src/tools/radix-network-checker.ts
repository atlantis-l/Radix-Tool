import {
  GatewayApiClient,
  StateEntityDetailsOperationRequest,
  TransactionCommittedDetailsOperationRequest,
} from "@radixdlt/babylon-gateway-api-sdk";
import { selectNetwork } from "../common";

class RadixNetworkChecker {
  //@ts-ignore
  networkId: number;
  //@ts-ignore
  private NETWORK_API: GatewayApiClient;

  constructor(networkId: number) {
    this.setNetworkId(networkId);
  }

  setNetworkId(networkId: number) {
    this.networkId = networkId;
    this.NETWORK_API = selectNetwork(networkId);
  }

  checkEntities(addresses: string[]) {
    const request: StateEntityDetailsOperationRequest = {
      stateEntityDetailsRequest: {
        addresses: addresses,
        aggregation_level: "Vault",
        opt_ins: {
          ancestor_identities: true,
          non_fungible_include_nfids: true,
          package_royalty_vault_balance: true,
          component_royalty_vault_balance: true,
        },
      },
    };

    return this.NETWORK_API.state.innerClient.stateEntityDetails(request);
  }

  checkTransaction(transactionId: string) {
    const request: TransactionCommittedDetailsOperationRequest = {
      transactionCommittedDetailsRequest: {
        intent_hash: transactionId,
      },
    };

    return this.NETWORK_API.transaction.innerClient.transactionCommittedDetails(
      request,
    );
  }
}

export { RadixNetworkChecker };
