import {
  StateEntityDetailsOperationRequest,
  TransactionCommittedDetailsOperationRequest,
} from "@radixdlt/babylon-gateway-api-sdk";
import { selectNetwork } from "../common";
import { NameAndSymbol, ResourcesOfAccount } from "../models";

class RadixNetworkChecker {
  networkId: number;

  constructor(networkId: number) {
    this.networkId = networkId;
  }

  checkEntities(addresses: string[]) {
    const deduplicatedAddresses: string[] = [];

    new Set(addresses).forEach((address) =>
      deduplicatedAddresses.push(address),
    );

    const request: StateEntityDetailsOperationRequest = {
      stateEntityDetailsRequest: {
        addresses: deduplicatedAddresses,
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

  async checkResourcesOfAccounts(
    addresses: string[],
  ): Promise<ResourcesOfAccount[]> {
    const deduplicatedAddresses: string[] = [];

    new Set(addresses).forEach((address) =>
      deduplicatedAddresses.push(address),
    );

    const response = await this.checkEntities(deduplicatedAddresses);

    //@ts-ignore
    return response.items.map((item) => {
      return {
        address: item.address,
        fungible: item.fungible_resources?.items.map((fungibleItem) => {
          //@ts-ignore
          const amount = fungibleItem.vaults.items[0].amount;
          return {
            resourceAddress: fungibleItem.resource_address,
            amount: amount === undefined ? "0" : amount,
          };
        }),
        nonFungible: item.non_fungible_resources?.items.map(
          (nonFungibleItem) => {
            //@ts-ignore
            const items = nonFungibleItem.vaults.items[0].items;
            return {
              resourceAddress: nonFungibleItem.resource_address,
              ids: items === undefined ? [] : items,
            };
          },
        ),
      };
    });
  }

  async checkSymbolsOfResources(resourceAddresses: string[]) {
    const deduplicatedAddresses: string[] = [];

    new Set(resourceAddresses).forEach((address) =>
      deduplicatedAddresses.push(address),
    );

    const response = await this.checkEntities(deduplicatedAddresses);

    const resourceSymbolMap = new Map<string, NameAndSymbol>();

    response.items.forEach((item) => {
      //@ts-ignore
      const symbol = item.metadata.items.find(
        (metadataItem) => metadataItem.key === "symbol",
        //@ts-ignore
      );

      //@ts-ignore
      const name = item.metadata.items.find(
        (metadataItem) => metadataItem.key === "name",
        //@ts-ignore
      ).value.typed.value;

      resourceSymbolMap.set(item.address, {
        name: name,
        //@ts-ignore
        symbol: symbol === undefined ? undefined : symbol.value.typed.value,
      });
    });

    return resourceSymbolMap;
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
