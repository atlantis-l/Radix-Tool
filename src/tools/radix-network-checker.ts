import {
  StateEntityDetailsOperationRequest,
  TransactionCommittedDetailsOperationRequest,
} from "@radixdlt/babylon-gateway-api-sdk";
import { selectNetwork } from "../common";
import { ResourceInfo, ResourcesOfAccount } from "../models";

class RadixNetworkChecker {
  networkId: number;

  constructor(networkId: number) {
    this.networkId = networkId;
  }

  checkEntities(addresses: string[]) {
    const request: StateEntityDetailsOperationRequest = {
      stateEntityDetailsRequest: {
        addresses: [...new Set(addresses)],
        aggregation_level: "Vault",
        opt_ins: {
          ancestor_identities: true,
          non_fungible_include_nfids: true,
          package_royalty_vault_balance: true,
          component_royalty_vault_balance: true,
        },
      },
    };

    return selectNetwork(this.networkId).state.innerClient.stateEntityDetails(
      request,
    );
  }

  async checkResourcesOfAccounts(addresses: string[]) {
    const response = await selectNetwork(
      this.networkId,
    ).state.getEntityDetailsVaultAggregated([...new Set(addresses)], {
      explicitMetadata: ["name", "symbol"],
    });

    return response.map((item) => {
      return {
        address: item.address,
        fungible: item.fungible_resources.items.map((resource) => {
          const amount = resource.vaults.items[0].amount;
          return {
            resourceAddress: resource.resource_address,
            name: resource.explicit_metadata?.items.find(
              (item) => item.key === "name",
              //@ts-ignore
            )?.value.typed.value,
            symbol: resource.explicit_metadata?.items.find(
              (item) => item.key === "symbol",
              //@ts-ignore
            )?.value.typed.value,
            amount: amount ? amount : "0",
          } as ResourceInfo;
        }),
        nonFungible: item.non_fungible_resources.items.map((resource) => {
          const items = resource.vaults.items[0].items;
          return {
            resourceAddress: resource.resource_address,
            name: resource.explicit_metadata?.items.find(
              (item) => item.key === "name",
              //@ts-ignore
            )?.value.typed.value,
            symbol: resource.explicit_metadata?.items.find(
              (item) => item.key === "symbol",
              //@ts-ignore
            )?.value.typed.value,
            ids: items ? items : ([] as string[]),
          } as ResourceInfo;
        }),
      } as ResourcesOfAccount;
    });
  }

  checkTransaction(transactionId: string) {
    const request: TransactionCommittedDetailsOperationRequest = {
      transactionCommittedDetailsRequest: {
        intent_hash: transactionId,
      },
    };

    return selectNetwork(
      this.networkId,
    ).transaction.innerClient.transactionCommittedDetails(request);
  }
}

export { RadixNetworkChecker };
