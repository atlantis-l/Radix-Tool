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

  async checkEntities(addresses: string[]) {
    const request: StateEntityDetailsOperationRequest = {
      stateEntityDetailsRequest: {
        addresses: addresses,
        opt_ins: {
          non_fungible_include_nfids: true,
        },
      },
    };

    return this.NETWORK_API.state.innerClient.stateEntityDetails(request);
  }

  async checkTransaction(transactionId: string) {
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
